import { Injectable } from '@angular/core';
import { JanoProvider } from '../jano/jano';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LlavesProvider {
  private listadoLlavesBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public listadoLlaves$ : Observable<any[]> = this.listadoLlavesBehaviorSubject.asObservable();

  private db;
  constructor(public janoProv: JanoProvider) {
    this.db = janoProv.getJanoFirestoreDb();

    this.db.collection("llaves")
    .where("dueño", "==", "TJGuSY13thdL1CFaiXjOyEfzk7k1")
    .onSnapshot({ includeMetadataChanges: true },
      querySnapshot => {
        console.log("Snapshot recibido llaves");
        let listadoLlaves=[];
        querySnapshot.forEach(
          doc => listadoLlaves.push({
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

        console.log("listado de llaves obtenido:", listadoLlaves);
        this.listadoLlavesBehaviorSubject.next(listadoLlaves);
      }
    );

  }

}
