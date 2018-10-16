import { Injectable } from '@angular/core';
import { JanoProvider } from '../jano/jano';
import { Cerradura } from '../../models/cerradura';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Llave } from '../../models/llave';
import { UsuariosProvider } from '../usuarios/usuarios';
import { LlavesProvider } from '../llaves/llaves';
import { ArduinoToApp } from '../../models/arduinoToApp';
import { AppToArduino } from '../../models/appToArduino';
import { EventosProvider } from '../eventos/eventos';
import { EventosCerradura } from '../../models/eventosCerradura';

@Injectable()
export class CerradurasProvider {
  private listadoCerradurasBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private listadoCerraduras$: Observable<any[]> = this.listadoCerradurasBehaviorSubject.asObservable();
  private usuario: string;
  private firestore;
  private realtime;
  private cerradura: Cerradura;

  constructor(public janoProv: JanoProvider, public usuariosProv: UsuariosProvider, public llavesProv: LlavesProvider, public eventosProv: EventosProvider) {
    this.firestore = janoProv.getJanoFirestoreDb();
    this.realtime = janoProv.getJanoRealtime();

   // this.resetCerraduras();

  }
  public obtenerCerraduras(userId: string) {
    console.log('Obteniendo cerraduras');
    if (this.usuario != userId) {
      this.usuario = userId;
      console.log('Suscribiendo cerraduras');
      this.firestore.collection("cerraduras")
        .where("dueño", "==", this.usuariosProv.getUsuario())
        .onSnapshot({ includeMetadataChanges: true },
          querySnapshot => {
            console.log("Snapshot recibido");
            let listadoCerraduras = [];
            querySnapshot.forEach(
              doc => listadoCerraduras.push({
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

            console.log("listado de cerraduras obtenido:", listadoCerraduras);
            this.listadoCerradurasBehaviorSubject.next(listadoCerraduras);
          }
        );
    }
    return this.listadoCerraduras$;
  }

  public agregarCerradura(cerr: Cerradura) {
    console.log("Agregar cerradura:");
    cerr.dueño = this.usuariosProv.getUsuario();
    // Alta de cerradura
    this.firestore.collection("cerraduras").add(cerr).then(
      cerraduraAlta => {
        console.log("Alta de cerradura exitosa con ID: ", cerraduraAlta.id);
        let evento=<EventosCerradura>{}
        evento.cerraduraId=cerraduraAlta.id
        evento.fechaHora= new Date();
        evento.queHizo  = "Alta de cerradura";
        evento.quienFue = this.usuariosProv.nombreDeUsuario();
        this.eventosProv.agregarEvento(evento);

        // alta de cerradura en realtime
        let appToArduino=<AppToArduino>{};
        appToArduino.comando="X";
        appToArduino.saldo=0;
        appToArduino.numerosDeConfianza="X";
        appToArduino.reset="X";
        this.realtime.ref(cerr.codigoActivacion + '/appToArduino')
        .set(appToArduino)
        .then(console.log("Registro de cerradura realtime"))
        .catch(e => console.log("Error en alta de cerradura realtime", e));
        let arduinoToApp=<ArduinoToApp>{};
        arduinoToApp.comando="X";
        arduinoToApp.puertaEstado="X";
        arduinoToApp.puertaForzada="X";
        this.realtime.ref(cerr.codigoActivacion + '/arduinoToApp')
        .set(appToArduino)
        .then(console.log("Registro de cerradura realtime"))
        .catch(e => console.log("Error en alta de cerradura realtime", e));

        // fin de alta en realtime
        let nuevaLlave = <Llave>{};
        nuevaLlave.idCerradura = cerraduraAlta.id;
        nuevaLlave.codigoActivacion = cerr.codigoActivacion;
        nuevaLlave.nombreFamiliar = cerr.descripcion;
        nuevaLlave.dueño = cerr.dueño;
        nuevaLlave.estado = cerr.estado;
        nuevaLlave.aperturaOffline = true;
        nuevaLlave.aperturaRemota = true;
        nuevaLlave.nroSecuencia = 0;
        nuevaLlave.esAdministrador = true;
        nuevaLlave.franjaHorariaDesde = null;
        nuevaLlave.franjaHorariaHasta = null;
        nuevaLlave.vigenciaDesde = null;
        nuevaLlave.vigenciaHasta = null;
        nuevaLlave.telefonoCerradura = cerr.telefonoPropio;
        nuevaLlave.aperturaAutomatica = false, 
        nuevaLlave.cierreAutomatico = false,
    
        nuevaLlave.vigenciaDias = {
          domingo: true,
          lunes: true,
          martes: true,
          miercoles: true,
          jueves: true,
          viernes: true,
          sabado: true
        };

        this.llavesProv.crearLlave(nuevaLlave).then(
          llaveAlta => {
            console.log("Alta de llave exitosa con ID: ", llaveAlta.id);
            let evento=<EventosCerradura>{}
            evento.cerraduraId=cerraduraAlta.id
            evento.fechaHora= new Date();
            evento.queHizo  = "Alta de llave";
            evento.quienFue = this.usuariosProv.nombreDeUsuario();
            this.eventosProv.agregarEvento(evento);
          }).catch(error => console.error("Error agregando llave: ", error));
      }).catch(error => console.error("Error agregando cerradura: ", error));
  }

  public modificarCerradura(cerr: Cerradura) {
    console.log('cerradura obtenida para modificar', cerr);
    this.firestore.collection("cerraduras").doc(cerr.id)
      .update(cerr)
      .then(() => console.log("Modificacion de cerradura exitosa"))
      .catch(error => console.error("Error modificando cerradura: ", error));
  }

  public eliminarCerradura(cerr: Cerradura) {
    console.log('cerradura obtenida para eliminar', cerr);
    this.firestore.collection("cerraduras").doc(cerr.id)
      .delete()
      .then(() => console.log("Eliminacion de cerradura exitosa"))
      .catch(error => console.error("Error eliminando cerradura: ", error));
  }

  public resetCerraduras() {
    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = this.usuariosProv.getUsuario();
    this.cerradura.descripcion = 'Rivadavia 6542';
    this.cerradura.estado = 'CER';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.codigoActivacion = 'codigoCerradura1'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = this.usuariosProv.getUsuario();
    this.cerradura.descripcion = 'Cuenca 895';
    this.cerradura.estado = 'ABR';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.codigoActivacion = 'codigoCerradura2'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = this.usuariosProv.getUsuario();
    this.cerradura.descripcion = 'Pasteur 885';
    this.cerradura.estado = 'ABR';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.codigoActivacion = 'codigoCerradura3'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = this.usuariosProv.getUsuario();
    this.cerradura.descripcion = 'Arieta 402';
    this.cerradura.estado = 'CER';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.codigoActivacion = 'codigoCerradura4'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);
  }
}
