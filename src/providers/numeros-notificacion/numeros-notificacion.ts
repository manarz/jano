import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { JanoProvider } from '../jano/jano';
import { Cerradura } from '../../models/cerradura';
import { NumerosNotificacion } from '../../models/numerosNotificacion';

@Injectable()
export class NumerosNotificacionProvider {
  private listadoNumerosBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public listadoNumeros$ : Observable<any[]> = this.listadoNumerosBehaviorSubject.asObservable();

  private db;
  constructor(public janoProv:JanoProvider) {
    this.db=janoProv.getJanoFirestoreDb();
 }
  public getNumeros(cerr:Cerradura){
    this.db.collection("numerosNotificacion")
    .where("cerraduraId", "==", cerr.id)
    .onSnapshot({ includeMetadataChanges: true },
        querySnapshot => {
          console.log("Consultando listado de numeros");
          let listadoNumeros=[];
          querySnapshot.forEach(
            doc => listadoNumeros.push({
              id: doc.id,
              ...doc.data()
            })
          )

          //registro de cambios recibidos
          querySnapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                console.log("Nueva data id: "  , change.doc.id);
                console.log("Nueva data body: ", change.doc.data());
            } else{
                console.log("Cambio detectado: "+ change.type);
            }

            var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
            console.log("La info vino desde: " + source);
        });

          console.log("listado de numeros obtenido:", listadoNumeros);
          this.listadoNumerosBehaviorSubject.next(listadoNumeros);
        }
    )
  }
  
  public agregarNumero(cerr: Cerradura, numero: NumerosNotificacion) {
    numero.cerraduraId=cerr.id;
    console.log('numero obtenido para agregar', numero);
    this.db.collection("numerosNotificacion").add(numero).then(
      numeroAlta => {
        console.log("Alta de numero exitoso con ID: ", numeroAlta.id);
      })
      .then(() => console.log("Agregado de numero exitoso"))
      .catch(error => console.error("Error agregando numero: ", error));
  }

  public eliminarNumero(numero: NumerosNotificacion) {
    console.log('numero obtenida para eliminar', numero);
    this.db.collection("numerosNotificacion").doc(numero.id)
      .delete()
      .then(() => console.log("Eliminacion de numero exitoso"))
      .catch(error => console.error("Error eliminando numero: ", error));
  }
}
