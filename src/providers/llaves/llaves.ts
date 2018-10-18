import { Injectable } from '@angular/core';
import { JanoProvider } from '../jano/jano';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { UsuariosProvider } from '../usuarios/usuarios';
import { Llave } from '../../models/llave';
import { AlertController } from 'ionic-angular';
import { EventosCerradura } from '../../models/eventosCerradura';
import { EventosProvider } from '../eventos/eventos';
import { Cerradura } from '../../models/cerradura';

@Injectable()
export class LlavesProvider {
  private listadoLlavesBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private listadoLlaves$: Observable<any[]> = this.listadoLlavesBehaviorSubject.asObservable();
  private pedidoVigente: string;
  private firestore;
  private realtime; 
  constructor(public janoProv: JanoProvider, public usuariosProv: UsuariosProvider, public alertCtrl: AlertController, public eventosProv: EventosProvider) {
    this.firestore = janoProv.getJanoFirestoreDb();
    this.realtime = janoProv.getJanoRealtime();
  }
  public pad(n) {
    return n<10 ? '0'+n : n
  }
  public obtenerComandoAperturaCierre(llave: Llave){
    let comando=llave.estado=='ABR' ? 'CER':'ABR';
    comando+=';'+llave.nroSecuencia+';'
    let d=new Date();
    comando+=         d.getFullYear()
    comando+=this.pad(d.getMonth()+1)
    comando+=this.pad(d.getDay())
    comando+=this.pad(d.getHours())
    comando+=this.pad(d.getMinutes())
    comando+=this.pad(d.getSeconds())
    return comando;    
  }

  public crearLlave(nuevaLlave: Llave){
    console.log('llave obtenida para crear', nuevaLlave);
    return this.firestore.collection("llaves").add(nuevaLlave);
  }
  public modificarLlave(llave: Llave){
    console.log('llave obtenida para modificar', llave);
    this.firestore.collection("llaves").doc(llave.id)
    .update(llave)
    .then(() => console.log("Modificacion de llave exitosa"))
    .catch(error => console.error("Error modificando llave: ", error));
  }
  public eliminarLlave(llave: Llave) {
    console.log('llave obtenida para eliminar', llave);
    this.firestore.collection("llaves").doc(llave.id)
      .delete()
      .then(() => console.log("Eliminacion de llave exitosa"))
      .catch(error => console.error("Error eliminando llave: ", error));
  }
  public eliminarLlaves(cerradura: Cerradura){
    console.log("Eliminando llaves de cerradura", cerradura);
    this.firestore.collection("llaves")
    .where("idCerradura", "==", cerradura.id)
    .get()
    .then(
      querySnapshot => {
        console.log("Llaves encontradas");
        querySnapshot.forEach(    
          doc =>  this.eliminarLlave(doc.id)
        )}
    )
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
     return this.firestore.collection("llaves").doc(llaveId).get();
  }
  private obtenerLlaves(campo: string, operador: string, valor: string) {
    this.firestore.collection("llaves")
      .where(campo, operador, valor)
      .onSnapshot({ includeMetadataChanges: true },
        querySnapshot => {
          console.log("Snapshot recibido llaves");
          let listadoLlaves = [];
          querySnapshot.forEach(            
            doc => listadoLlaves.push({
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

          console.log("listado de llaves obtenido:", listadoLlaves);
          this.listadoLlavesBehaviorSubject.next(listadoLlaves);
        }
      );
  }
  public enviarComandoAperturaCierre(llave: Llave){
    this.realtime
    .ref(llave.codigoActivacion + '/appToArduino/comando')
    .set(this.obtenerComandoAperturaCierre(llave))
    .then(() =>{
      //Registro de evento
      let evento=<EventosCerradura>{}
      evento.cerraduraId=llave.idCerradura
      evento.fechaHora= new Date();
      evento.queHizo  = (llave.estado=='ABR')?'Cierre ':'Apertura ';
      evento.queHizo += "por internet";
      evento.quienFue = this.usuariosProv.nombreDeUsuario();
      this.eventosProv.agregarEvento(evento);
                    
      console.log('Sincronizado realtime');
      let alert = this.alertCtrl.create({
        title: 'Comando enviado',
        message: 'Comando enviado con exito',
        buttons: ['Ok']
      });
      alert.present();
      llave.estado=(llave.estado=='ABR')?'CER':'ABR';
      this.modificarLlave(llave);
    })
    .catch(e => {
      console.log('Error realtime:', e)
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'No se ha podido enviar el comando!',
        buttons: ['Ok']
      });
      alert.present();
    });
  }
}
