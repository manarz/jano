import { Injectable } from '@angular/core';
import { JanoProvider } from '../jano/jano';
import { Cerradura } from '../../models/cerradura';

@Injectable()
export class CerradurasProvider {
  public listadoCerraduras: any[];
  private db;
  private cerradura: Cerradura;
  constructor(janoProv: JanoProvider) {
    this.db = janoProv.getJanoFirestoreDb();
    
    this.cerradura = <Cerradura> {};
    this.cerradura.dueño = 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
    this.cerradura.estado = 'abierta';
    this.cerradura.telefonoPropio = '1132848322'; //telefono del chip
    this.cerradura.destinatariosNotificacionSms = { '1145454545': true, '1133552255': true };
    this.cerradura.redes = { 'home': { pass: 'homepass' }, 'fibertel': { pass: 'fiberpass'} };
    this.cerradura.codigoActivacion = 'TJGuSY13thdL1'; // Hash combinación entre cerradura.dueño y cerradura.id

    this.listadoCerraduras=[];
    console.log("listado de cerraduras vacio:", this.listadoCerraduras);
    this.db.collection("ejemplos").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          console.log("agregando el doc id: "+doc.id);
          //this.listadoCerraduras.push({ id:doc.id, data:doc.data });
          //console.log("listado de cerraduras lleno:", this.listadoCerraduras);
        });
    });
    //console.log("listado de cerraduras lleno:", this.listadoCerraduras);
  
    this.db.collection("ejemplos").add(this.cerradura).then(function(docRef) {
        console.log("Alta de registro con ID: ", docRef.id);
    }).catch(function(error) {
        console.error("Error agregando registro: ", error);
    });

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
      
/*    this.listadoCerraduras = [
    { esPropia: true,  descripcion: "Mi puerta frontal de casa",  estaAbierta: true , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },
    { esPropia: true,  descripcion: "Mi puerta de atras de casa", estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: true,  descripcion: "Mi garage",                  estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: true,  descripcion: "Casa del fondo",             estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: false, descripcion: "Garage de Matias",           estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: false, descripcion: "Puerta de Vero",             estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: false, descripcion: "Puerta de la tia",           estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: false, descripcion: "Puerta frontal de Matias",   estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: false, descripcion: "Puerta del abuelo",          estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } 
];
*/
  }
  public agregarCerradura(doc){
    console.log(doc.id, " => ", doc.data());
  }
  public getCerraduras(){
    return this.listadoCerraduras;
  }
  public addCerradura(cerradura:any){
    this.listadoCerraduras.push(cerradura);
  }
}
