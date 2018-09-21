import { Injectable } from '@angular/core';
import { JanoProvider } from '../jano/jano';
import { Cerradura } from '../../models/cerradura';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

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

          console.log("listado de redes obtenido:", listadoRedes);
          this.listadoRedesBehaviorSubject.next(listadoRedes);
        }
    )
  }
}
