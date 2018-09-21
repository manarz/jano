import { Injectable } from '@angular/core';
import { JanoProvider } from '../jano/jano';
import { Cerradura } from '../../models/cerradura';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Llave } from '../../models/llave';
import { Red } from '../../models/red';

@Injectable()
export class CerradurasProvider {
  private listadoCerradurasBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public listadoCerraduras$ : Observable<any[]> = this.listadoCerradurasBehaviorSubject.asObservable();

  public cerraduraCollection: AngularFirestoreCollection;
  private db;
  private cerradura: Cerradura;
  constructor(public janoProv: JanoProvider) {
    this.db = janoProv.getJanoFirestoreDb();
    
    this.cerraduraCollection = this.db.collection("cerraduras")
      .where("dueño", "==", "TJGuSY13thdL1CFaiXjOyEfzk7k1")
      .onSnapshot({ includeMetadataChanges: true },
        querySnapshot => {
          console.log("Snapshot recibido");
          let listadoCerraduras=[];
          querySnapshot.forEach(
            doc => listadoCerraduras.push({
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

          console.log("listado de cerraduras obtenido:", listadoCerraduras);
          this.listadoCerradurasBehaviorSubject.next(listadoCerraduras);
        }
      );
   // this.resetCerraduras();

    /*    
        { esPropia: true,  descripcion: "Mi puerta frontal de casa",  estaAbierta: true , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },
        { esPropia: true,  descripcion: "Mi puerta de atras de casa", estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
        { esPropia: true,  descripcion: "Mi garage",                  estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
        { esPropia: true,  descripcion: "Casa del fondo",             estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
        { esPropia: false, descripcion: "Garage de Matias",           estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
        { esPropia: false, descripcion: "Puerta de Vero",             estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
        { esPropia: false, descripcion: "Puerta de la tia",           estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
        { esPropia: false, descripcion: "Puerta frontal de Matias",   estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
        { esPropia: false, descripcion: "Puerta del abuelo",          estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } 
    
    ];*/
  }
  public agregarCerradura(cerr: Cerradura) {
    console.log("Agregar cerradura:");
    // alta de cerradura
    this.db.collection("cerraduras").add(cerr).then(
      cerraduraAlta => {
        console.log("Alta de cerradura exitosa con ID: ", cerraduraAlta.id);
        let nuevaLlave = <Llave>{};
        nuevaLlave.idCerradura = cerraduraAlta.id;
        nuevaLlave.nombreFamiliar = cerr.descripcion;
        nuevaLlave.dueño = cerr.dueño;
        nuevaLlave.estado = 'abierta';
        nuevaLlave.aperturaOffline = true,
          nuevaLlave.aperturaRemota = true,
          nuevaLlave.nroSecuencia = 0;
        nuevaLlave.esPropia = true;

        this.db.collection("llaves").add(nuevaLlave).then(
          llaveAlta => {
            console.log("Alta de llave exitosa con ID: ", llaveAlta.id);
          }).catch(error => console.error("Error agregando llave: ", error));
        for ( let nuevaRed of cerr.redes) {
          console.log("Red nueva:",nuevaRed);
          nuevaRed.cerraduraId=cerraduraAlta.id;

          this.db.collection("redes").add(nuevaRed).then(
            redAlta => {
              console.log("Alta de red exitosa con ID: ", redAlta.id);
            }).catch(error => console.error("Error agregando red: ", error));
        }

      }).catch(error => console.error("Error agregando cerradura: ", error));
  }

  public modificarCerradura(cerr: Cerradura){
    console.log('cerradura obtenida para modificar', cerr);
    this.db.collection("cerraduras").doc(cerr.id)
    .update(cerr)
    .then(() => console.log("Modificacion de cerradura exitosa"))
    .catch(error => console.error("Error modificando cerradura: ", error));
  }

  public eliminarCerradura(cerr: Cerradura) {
    console.log('cerradura obtenida para eliminar', cerr);
    this.db.collection("cerraduras").doc(cerr.id)
      .delete()
      .then(() => console.log("Eliminacion de cerradura exitosa"))
      .catch(error => console.error("Error eliminando cerradura: ", error));
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
  public resetCerraduras() {
    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
    this.cerradura.descripcion = 'Rivadavia 6542';
    this.cerradura.estado = 'cerrada';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.destinatariosNotificacionSms = { '1145454545': true, '1133552255': true };
    this.cerradura.redes = [] ;
    this.cerradura.redes.push(<Red>{ssid:'home', pass: 'homepass' });
    this.cerradura.redes.push(<Red>{ssid:'fibertel', pass: 'fiberpass' });
    this.cerradura.codigoActivacion = 'TJGuSY13thdL1'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
    this.cerradura.descripcion = 'Cuenca 895';
    this.cerradura.estado = 'abierta';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.destinatariosNotificacionSms = { '1145454545': true, '1133552255': true };
    this.cerradura.redes = [] ;
    this.cerradura.redes.push(<Red>{ssid:'home', pass: 'homepass' });
    this.cerradura.redes.push(<Red>{ssid:'fibertel', pass: 'fiberpass' });
    this.cerradura.codigoActivacion = 'TJGuSY13thdL1'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
    this.cerradura.descripcion = 'Pasteur 885';
    this.cerradura.estado = 'abierta';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.destinatariosNotificacionSms = { '1145454545': true, '1133552255': true };
    this.cerradura.redes = [] ;
    this.cerradura.redes.push(<Red>{ssid:'home', pass: 'homepass' });
    this.cerradura.redes.push(<Red>{ssid:'fibertel', pass: 'fiberpass' });
    this.cerradura.codigoActivacion = 'TJGuSY13thdL1'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
    this.cerradura.descripcion = 'Arieta 402';
    this.cerradura.estado = 'cerrada';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.destinatariosNotificacionSms = { '1145454545': true, '1133552255': true };
    this.cerradura.redes = [] ;
    this.cerradura.redes.push(<Red>{ssid:'home', pass: 'homepass' });
    this.cerradura.redes.push(<Red>{ssid:'fibertel', pass: 'fiberpass' });
    this.cerradura.codigoActivacion = 'TJGuSY13thdL1'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);
  }
  public getCerraduras(){
    return null;
  }
}
