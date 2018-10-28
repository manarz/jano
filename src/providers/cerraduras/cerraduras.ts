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
import { RedesProvider } from '../redes/redes';
import { NumerosNotificacionProvider } from '../numeros-notificacion/numeros-notificacion';

@Injectable()
export class CerradurasProvider {
  private listadoCerradurasBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private listadoCerraduras$: Observable<any[]> = this.listadoCerradurasBehaviorSubject.asObservable();
  private usuario: string;
  private firestore;
  private realtime;
  private cerradura: Cerradura;
  public saldo: string;

  constructor(
    public janoProv: JanoProvider,
    public usuariosProv: UsuariosProvider,
    public llavesProv: LlavesProvider,
    public eventosProv: EventosProvider,
    public redesProv: RedesProvider,
    public numerosProv: NumerosNotificacionProvider
  ) {
    this.firestore = janoProv.getJanoFirestoreDb();
    this.realtime = janoProv.getJanoRealtime();

    //this.resetCerraduras();

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
        let evento = <EventosCerradura>{}
        evento.cerraduraId = cerraduraAlta.id
        evento.fechaHora = new Date();
        evento.queHizo = "Alta de cerradura";
        evento.quienFue = this.usuariosProv.nombreDeUsuario();
        this.eventosProv.agregarEvento(evento);

        // alta de cerradura en realtime
        let appToArduino = <AppToArduino>{};
        appToArduino.comando = "X";
        appToArduino.saldo = 0;
        appToArduino.numerosDeConfianza = "X";
        appToArduino.reset = "X";
        this.realtime.ref(cerr.codigoActivacion + '/appToArduino')
          .set(appToArduino)
          .then(console.log("Registro de cerradura realtime"))
          .catch(e => console.log("Error en alta de cerradura realtime", e));
        let arduinoToApp = <ArduinoToApp>{};
        arduinoToApp.comando = "X";
        arduinoToApp.puertaEstado = "X";
        arduinoToApp.puertaForzada = "X";
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
            let evento = <EventosCerradura>{}
            evento.cerraduraId = cerraduraAlta.id
            evento.fechaHora = new Date();
            evento.queHizo = "Alta de llave";
            evento.quienFue = this.usuariosProv.nombreDeUsuario();
            this.eventosProv.agregarEvento(evento);
          }).catch(error => console.error("Error agregando llave: ", error));
      }).catch(error => console.error("Error agregando cerradura: ", error));
  }
  public vincularSaldo(cerradura: Cerradura) {
    this.realtime.ref(cerradura.codigoActivacion + '/arduinoToApp')
      .on('value', data => {
        console.log("Saldo obtenido:", data.val());
        this.saldo = (data.val() && data.val().saldo) ? data.val().saldo : '0';
      });
  }  
  public pedirSaldo(cerradura: Cerradura) {
    this.realtime.ref(cerradura.codigoActivacion + '/appToArduino/saldoPeriodo')
      .set('-1')
      .then(console.log("Registro de pedido de saldo realtime ok"))
      .catch(e => console.log("Error en pedido de saldo realtime", e));
  }
  public modificarCerradura(cerr: Cerradura) {
    console.log('cerradura obtenida para modificar', cerr);
    this.firestore.collection("cerraduras").doc(cerr.id)
      .update(cerr)
      .then(() => {
        console.log("Modificacion de cerradura exitosa")

        let notificaciones={} as any;
        notificaciones.saldoPeriodo = cerr.notificaSaldoXPeriodo || '0'
        notificaciones.saldo        = cerr.notificaSaldoMinimo|| '-1'
        notificaciones.notificaPuertaForzada  = cerr.notificaPuertaForzada || false
        notificaciones.notificaAperturaManual = cerr.notificaAperturaManual || false
        notificaciones.notificaBateriaBaja    = cerr.notificaBateriaBaja || false
        this.realtime.ref(cerr.codigoActivacion + '/appToArduino')
          .update(notificaciones)
          .then(console.log("Modificacion de cerradura realtime"))
          .catch(e => console.log("Error en modificacion de cerradura realtime", e));

        this.numerosProv.sincronizarNumerosNotificacion(cerr)
      })
      .catch(error => console.error("Error modificando cerradura: ", error));
  }

  public eliminarCerradura(cerr: Cerradura) {
    console.log('cerradura obtenida para eliminar', cerr);
    this.eventosProv.eliminarEventos(cerr)
    this.llavesProv.eliminarLlaves(cerr);
    this.redesProv.eliminarRedes(cerr);
    this.numerosProv.eliminarNumeros(cerr);

    this.realtime.ref(cerr.codigoActivacion)
      .set({ appToArduino: { configuracion: 'ELIMINADO' } })
      .then(console.log("Registro de cerradura realtime eliminado"))
      .catch(e => console.log("Error eliminando cerradura realtime", e));

    this.firestore.collection("cerraduras").doc(cerr.id)
      .delete()
      .then(() => console.log("Eliminacion de cerradura exitosa"))
      .catch(error => console.error("Error eliminando cerradura: ", error));
  }
  public eliminarCuenta(usuario:string){
    this.firestore.collection("cerraduras")
    .where("dueño", "==", usuario)
    .get()
    .then(
      querySnapshot => {
        console.log("Cerraduras encontradas");
        querySnapshot.forEach(    
          doc =>  this.eliminarCerradura({...doc.data(),id:doc.id})
        )}
    )
  }


  public resetCerraduras() {
    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = this.usuariosProv.getUsuario();
    this.cerradura.descripcion = 'Rivadavia 6542';
    this.cerradura.estado = 'CER';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.codigoActivacion = 'Rivadavia'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = this.usuariosProv.getUsuario();
    this.cerradura.descripcion = 'Cuenca 895';
    this.cerradura.estado = 'ABR';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.codigoActivacion = 'Cuenca'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = this.usuariosProv.getUsuario();
    this.cerradura.descripcion = 'Pasteur 885';
    this.cerradura.estado = 'ABR';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.codigoActivacion = 'Pasteur'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = this.usuariosProv.getUsuario();
    this.cerradura.descripcion = 'Arieta 402';
    this.cerradura.estado = 'CER';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.codigoActivacion = 'Arieta'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);
  }
}
