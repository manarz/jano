import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { JanoProvider } from '../jano/jano';
import { Cerradura } from '../../models/cerradura';
import { EventosCerradura } from '../../models/eventosCerradura';


@Injectable()
export class EventosProvider {
  private listadoEventosBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public  listadoEventos$: Observable<any[]> = this.listadoEventosBehaviorSubject.asObservable();
  private firestore;
  constructor(private janoProv: JanoProvider) {
    this.firestore = janoProv.getJanoFirestoreDb();
  }
  public eliminarEventos(cerradura: Cerradura){
    console.log("Eliminando eventos de cerradura", cerradura);
    this.firestore.collection("eventosCerradura")
    .where("cerraduraId", "==", cerradura.id)
    .get()
    .then(
      querySnapshot => {
        console.log("Eventos encontrados");
        querySnapshot.forEach(    
          doc =>  this.eliminarEvento(doc.id)
        )}
    )
  }
  public eliminarEvento(idEvento: string) {
    console.log('evento obtenido para eliminar', idEvento);
    this.firestore.collection("eventosCerradura").doc(idEvento)
      .delete()
      .then(() => console.log("Eliminacion de evento exitoso"))
      .catch(error => console.error("Error eliminando evento: ", error));
  }

  
  public agregarEvento(evento: EventosCerradura) {
    console.log('evento obtenido para registrar', evento);
    this.firestore.collection("eventosCerradura").add(evento).then(
      eventoAlta => {
        console.log("Alta de evento exitoso con ID: ", eventoAlta.id);
      })
      .catch(error => console.error("Error agregando evento: ", error));
  }

  public obtenerEventos(cerr: Cerradura) {
    this.firestore.collection("eventosCerradura")
      .where("cerraduraId", "==", cerr.id)
      .orderBy("fechaHora","desc")
      .onSnapshot({ includeMetadataChanges: true },
        querySnapshot => {
          console.log("Consultando listado de eventos");
          let listadoEventos = [];
          querySnapshot.forEach(
            doc => listadoEventos.push({
              ...doc.data(),
              id: doc.id
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

          console.log("listado de eventos obtenido:", listadoEventos);
          this.listadoEventosBehaviorSubject.next(listadoEventos);
        }
      )
  }
}
