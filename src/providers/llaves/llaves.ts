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
  private codigoActivacionJano: string;
  private referenceToJano;
  private firestore;
  private realtime;
  constructor(public janoProv: JanoProvider, public usuariosProv: UsuariosProvider, public alertCtrl: AlertController, public eventosProv: EventosProvider) {
    this.firestore = janoProv.getJanoFirestoreDb();
    this.realtime = janoProv.getJanoRealtime();
    this.codigoActivacionJano = 'unlam2018'
    this.referenceToJano=null;

    this.realtime.ref('codigoActivacionJano')
    .on('value', snapshot => {
      console.log('Nuevo codigo de activacion jano');
      this.codigoActivacionJano=snapshot.val();
      if(this.referenceToJano){
        this.referenceToJano.off();
        this.referenceToJano=null;
      }
      this.sincronizarJanoReal();
    })
    ;
  }
  public sincronizarJanoReal(){
    this.referenceToJano=this.realtime.ref(this.codigoActivacionJano + '/arduinoToApp/comando')
    this.referenceToJano.on('value', snapshot => {
      let campos=snapshot.val().split(';')
      if (campos[0] == 'COK') {
        console.log('CERRADO');
        this.actualizarEstadoLlavesJano('CER', Number(campos[1]))

      } else if (campos[0] == 'AOK') {
        console.log('ABIERTO')
        this.actualizarEstadoLlavesJano('ABR', Number(campos[1]))
      } else console.log('comando jano actualizado a: ' + snapshot.val())
    })
    
  }
  public actualizarEstadoLlavesJano(estado: string, secuencia: number) {
    this.firestore.collection("llaves")
      .where('codigoActivacion', '==', this.codigoActivacionJano)
      .get()
      .then(
        querySnapshot => {
          console.log("Se actualizaran llaves asociadas a "+this.codigoActivacionJano);
          querySnapshot.forEach(
            doc => {
              let llaveJano={...doc.data(),id:doc.id}
              let huboCambio=false;
              console.log("Llave asociada jano real", llaveJano);
              if(llaveJano.estado!=estado){
                llaveJano.estado=estado;
                huboCambio=true;
              }
              if(llaveJano.nroSecuencia < secuencia){
                llaveJano.nroSecuencia=secuencia;
                huboCambio=true;
              }
              if(huboCambio){
                this.modificarLlave(llaveJano)
              }
            })
          
        })
      .catch(function (error) {
        console.log("Error sincronizando estados de llaves jano reales: ", error);
      });
  }

  public pad(n) {
    return n < 10 ? '0' + n : n
  }
  public obtenerComandoAperturaCierre(llave: Llave) {
    let comando = llave.estado == 'ABR' ? 'CER' : 'ABR';
    comando += ';' + llave.nroSecuencia + ';'
    let d = new Date();
    //comando += d.getFullYear()
    //comando += this.pad(d.getMonth() + 1)
    //comando += this.pad(d.getDate())
    comando += this.pad(d.getHours())
    comando += this.pad(d.getMinutes())
    comando += this.pad(d.getSeconds())
    return comando;
  }

  public crearLlave(nuevaLlave: Llave) {
    console.log('llave obtenida para crear', nuevaLlave);
    return this.firestore.collection("llaves").add(nuevaLlave);
  }
  public modificarLlave(llave: Llave) {
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
  public eliminarCuenta(usuario: string) {
    this.firestore.collection("llaves")
      .where("dueño", "==", usuario)
      .get()
      .then(
        querySnapshot => {
          console.log("Llaves encontradas");
          querySnapshot.forEach(
            doc => this.eliminarLlave({ ...doc.data(), id: doc.id })
          )
        }
      )

  }
  public eliminarLlaves(cerradura: Cerradura) {
    console.log("Eliminando llaves de cerradura", cerradura);
    this.firestore.collection("llaves")
      .where("idCerradura", "==", cerradura.id)
      .get()
      .then(
        querySnapshot => {
          console.log("Llaves encontradas");
          querySnapshot.forEach(
            doc => this.eliminarLlave({ ...doc.data(), id: doc.id })
          )
        }
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
  public obtenerLlaveDueñoCerradura(cerradura: Cerradura) {
    console.log("Obteniendo llave del dueño de la cerradura:" +
      "dueño" + "==" + this.usuariosProv.getUsuario() +
      "idCerradura" + "==" + cerradura.id
    );
    return this.firestore.collection("llaves")
      .where("idCerradura", "==", cerradura.id)
      .where("dueño", "==", this.usuariosProv.getUsuario())
      .get();
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
  public enviarComandoAperturaCierre(llave: Llave) {
    this.realtime
      .ref(llave.codigoActivacion + '/appToArduino/comando')
      .set(this.obtenerComandoAperturaCierre(llave))
      .then(() => {
        console.log('Registro ok de comando de apertura/cierre realtime. Se registra evento.');
        //Registro de evento
        let evento = <EventosCerradura>{}
        evento.cerraduraId = llave.idCerradura
        evento.fechaHora = new Date();
        evento.queHizo = (llave.estado == 'ABR') ? 'Cierre ' : 'Apertura ';
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
        if(this.codigoActivacionJano!=llave.codigoActivacion){
          llave.estado = (llave.estado == 'ABR') ? 'CER' : 'ABR';
        }
        llave.nroSecuencia++
        this.modificarLlave(llave);
      })
      .catch(e => {
        console.log('Error realtime:', JSON.stringify(e, Object.getOwnPropertyNames(e)))
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: 'No se ha podido enviar el comando!',
          buttons: ['Ok']
        });
        alert.present();
      });
  }
}
