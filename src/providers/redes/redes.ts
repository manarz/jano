import { Injectable } from '@angular/core';
import { JanoProvider } from '../jano/jano';
import { Cerradura } from '../../models/cerradura';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Red } from '../../models/red';

@Injectable()
export class RedesProvider {
  private listadoRedesBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public listadoRedes$ : Observable<any[]> = this.listadoRedesBehaviorSubject.asObservable();

  private db;
  constructor(public janoProv:JanoProvider) {
    this.db=janoProv.getJanoFirestoreDb();
 }
  public getRedes(cerr:Cerradura){
    this.db.collection("redes")
    .where("cerraduraId", "==", cerr.id)
    .onSnapshot({ includeMetadataChanges: true },
        querySnapshot => {
          console.log("Consultando listado de redes");
          let listadoRedes=[];
          querySnapshot.forEach(
            doc => listadoRedes.push({
              ...doc.data(),
              id: doc.id
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

          console.log("listado de redes obtenido:", listadoRedes);
          this.listadoRedesBehaviorSubject.next(listadoRedes);
        }
    )
  }
  public agregarRed(cerr: Cerradura, red: Red) {
    red.cerraduraId=cerr.id;
    console.log('red obtenida para agregar', red);
    this.db.collection("redes").add(red).then(
      redAlta => {
        console.log("Alta de red exitosa con ID: ", redAlta.id);
      })
      .then(() => console.log("Agregado de cerradura exitosa"))
      .catch(error => console.error("Error agregando cerradura: ", error));
  }
  public eliminarRed(red: Red) {
    console.log('red obtenida para eliminar', red);
    this.db.collection("redes").doc(red.id)
      .delete()
      .then(() => console.log("Eliminacion de red exitosa"))
      .catch(error => console.error("Error eliminando red: ", error));
  }
}
