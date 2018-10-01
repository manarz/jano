import { Injectable } from '@angular/core';
import { JanoProvider } from '../jano/jano';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { UsuariosProvider } from '../usuarios/usuarios';
import { Llave } from '../../models/llave';

@Injectable()
export class LlavesProvider {
  private listadoLlavesBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private listadoLlaves$: Observable<any[]> = this.listadoLlavesBehaviorSubject.asObservable();
  private pedidoVigente: string;
  private db;
  constructor(public janoProv: JanoProvider, public usuariosProv: UsuariosProvider) {
    this.db = janoProv.getJanoFirestoreDb();
  }
  public crearLlave(nuevaLlave: Llave){
    console.log('llave obtenida para crear y compartir', nuevaLlave);
    return this.db.collection("llaves").add(nuevaLlave);
  }
  public modificarLlave(llave: Llave){
    console.log('llave obtenida para modificar', llave);
    this.db.collection("llaves").doc(llave.id)
    .update(llave)
    .then(() => console.log("Modificacion de llave exitosa"))
    .catch(error => console.error("Error modificando llave: ", error));
  }

  public obtenerLlavesPropias(userId: string) {
    if (this.pedidoVigente != 'llavesPropias' + userId) {
      this.pedidoVigente = 'llavesPropias' + userId;
      this.obtenerLlaves("dueño", "==", userId);
    }
    return this.listadoLlaves$;
  }

  public obtenerLlavesCerradura(cerraduraId: string) {
    if (this.pedidoVigente != 'llavesCerradura' + cerraduraId) {
      this.pedidoVigente = 'llavesCerradura' + cerraduraId;
      this.obtenerLlaves("idCerradura", "==", cerraduraId);
    }
    return this.listadoLlaves$;
  }
  public obtenerLlavePuntual(llaveId: string) {
     return this.db.collection("llaves").doc(llaveId).get();
  }
  private obtenerLlaves(campo: string, operador: string, valor: string) {
    this.db.collection("llaves")
      .where(campo, operador, valor)
      .onSnapshot({ includeMetadataChanges: true },
        querySnapshot => {
          console.log("Snapshot recibido llaves");
          let listadoLlaves = [];
          querySnapshot.forEach(
            doc => listadoLlaves.push({
              id: doc.id,
              ...doc.data()
            })
          )
          //registro de cambios recibidos
          querySnapshot.docChanges().forEach(function (change) {
            if (change.type === "added") {
              console.log("Nueva data id: ", change.doc.id);
              console.log("Nueva data body: ", change.doc.data());
            } else {
              console.log("Cambio detectado: " + change.type);
            }

            var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
            console.log("La info vino desde: " + source);
          });

          console.log("listado de llaves obtenido:", listadoLlaves);
          this.listadoLlavesBehaviorSubject.next(listadoLlaves);
        }
      );
  }
}
