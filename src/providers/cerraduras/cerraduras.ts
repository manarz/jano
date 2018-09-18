import { Injectable } from '@angular/core';
import { JanoProvider } from '../jano/jano';
import { Cerradura } from '../../models/cerradura';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CerradurasProvider {
  //public listadoCerraduras: any[];

  private listadoCerradurasBehaviorSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public listadoCerraduras$ : Observable<any[]> = this.listadoCerradurasBehaviorSubject.asObservable();

  public cerraduraCollection: AngularFirestoreCollection;
  private db;
  private cerradura: Cerradura;
  constructor(janoProv: JanoProvider) {
    this.db = janoProv.getJanoFirestoreDb();
    
    this.cerraduraCollection = this.db.collection("cerradurasv1")
      .where("dueño", "==", "TJGuSY13thdL1CFaiXjOyEfzk7k1")
      .onSnapshot(
        querySnapshot => {
          console.log("Snapshot recibido");
          let listadoCerraduras=[];
          querySnapshot.forEach(
            doc => listadoCerraduras.push({
              id: doc.id,
              data: doc.data()
            })
          )
          console.log("listado de cerraduras obtenido:", listadoCerraduras);
          this.listadoCerradurasBehaviorSubject.next(listadoCerraduras);
        }
      );
      
    /*
        this.db.collection("cerradurasv1").where("dueño", "==", "TJGuSY13thdL1CFaiXjOyEfzk7k1")
        .get().then(
          (querySnapshot) => { 
            querySnapshot.forEach(
              doc => {
              //console.log("obteniendo el doc:",doc.id,doc.data());
              let cerradura = doc.data();
              cerradura.id  = doc.id;
              this.listadoCerraduras.push(cerradura);
            });
            console.log("listado de cerraduras lleno:", this.listadoCerraduras);
          }
        );
    */
    // this.resetCerraduras();

    //    this.listadoCerraduras=[];
    /*
        this.db.collection("ejemplos").where("dueño", "==", "TJGuSY13thdL1CFaiXjOyEfzk7k1")
          .onSnapshot({ includeMetadataChanges: true }, function(snapshot) {
              snapshot.docChanges().forEach(function(change) {
                  if (change.type === "added") {
                      console.log("Nueva data id: "  , change.doc.id);
                      console.log("Nueva data body: ", change.doc.data());
                  } else{
                      console.log("Cambio detectado: "+ change.type);
                  }
    
                  var source = snapshot.metadata.fromCache ? "local cache" : "server";
                  console.log("La info vino desde: " + source);
              });
          });
    */
    /*
  this.listadoCerraduras = [
    { esPropia: true,  descripcion: "Centro de computos",  estaAbierta: false , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },
    { esPropia: true,  descripcion: "Jaula Velociraptor",  estaAbierta: false , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },
    { esPropia: true,  descripcion: "Jaula Tiranosaurio Rex",  estaAbierta: true , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },
    { esPropia: true,  descripcion: "Acceso Jaulas Sur",  estaAbierta: true , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },
    { esPropia: true,  descripcion: "Acceso Jaulas Norte",  estaAbierta: false , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },
    { esPropia: true,  descripcion: "Tienda de recuerdos",  estaAbierta: true , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },
    { esPropia: true,  descripcion: "Sala de invitados",  estaAbierta: false , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },
    { esPropia: true,  descripcion: "Sala de control",  estaAbierta: true , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },

*/

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
  public agregarCerradura(cer) {
    console.log("inicio agregar cerradura");
    // alta de cerradura
    this.db.collection("cerradurasv1").add(cer).then(
      (docAlta) => {
        console.log("Alta de cerradura con ID: ", docAlta.id);
      }).catch(function (error) {
        console.error("Error agregando cerradura: ", error);
      });
  }

  public resetCerraduras() {
    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
    this.cerradura.descripcion = 'Rivadavia 6542';
    this.cerradura.estado = 'cerrada';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.destinatariosNotificacionSms = { '1145454545': true, '1133552255': true };
    this.cerradura.redes = { 'home': { pass: 'homepass' }, 'fibertel': { pass: 'fiberpass' } };
    this.cerradura.codigoActivacion = 'TJGuSY13thdL1'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
    this.cerradura.descripcion = 'Cuenca 895';
    this.cerradura.estado = 'abierta';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.destinatariosNotificacionSms = { '1145454545': true, '1133552255': true };
    this.cerradura.redes = { 'home': { pass: 'homepass' }, 'fibertel': { pass: 'fiberpass' } };
    this.cerradura.codigoActivacion = 'TJGuSY13thdL1'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
    this.cerradura.descripcion = 'Pasteur 885';
    this.cerradura.estado = 'abierta';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.destinatariosNotificacionSms = { '1145454545': true, '1133552255': true };
    this.cerradura.redes = { 'home': { pass: 'homepass' }, 'fibertel': { pass: 'fiberpass' } };
    this.cerradura.codigoActivacion = 'TJGuSY13thdL1'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

    this.cerradura = <Cerradura>{};
    this.cerradura.dueño = 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
    this.cerradura.descripcion = 'Arieta 402';
    this.cerradura.estado = 'cerrada';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.destinatariosNotificacionSms = { '1145454545': true, '1133552255': true };
    this.cerradura.redes = { 'home': { pass: 'homepass' }, 'fibertel': { pass: 'fiberpass' } };
    this.cerradura.codigoActivacion = 'TJGuSY13thdL1'; // Hash combinación entre cerradura.dueño y cerradura.id
    this.agregarCerradura(this.cerradura);

  }

  public getCerraduras() {
    return null;
  }
  public addCerradura(cerradura: any) {
    this.listadoCerraduras.push(cerradura);
  }
}
