import { Injectable } from '@angular/core';

@Injectable()
export class CerradurasProvider {
  private listadoCerraduras: any[];

  constructor() {
    this.listadoCerraduras = [{ esPropia: true,  descripcion: "Mi puerta frontal de casa", estaAbierta: true , celular:"1132848322", redWifi:[{ssid:"fiber1",pass:"12345"}] },
    { esPropia: true,  descripcion: "Mi puerta de atras de casa", estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: true,  descripcion: "Mi garage",                  estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: true,  descripcion: "Casa del fondo",          estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: false, descripcion: "Garage de Matias",          estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: false, descripcion: "Puerta de Vero",          estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: false, descripcion: "Puerta de la tia",          estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: false, descripcion: "Puerta frontal de Matias",          estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } ,
    { esPropia: false, descripcion: "Puerta del abuelo",          estaAbierta: false, celular:"3372",       redWifi:[{ssid:"fiber2",pass:"pepe1"}] } 
];
  }
  public getCerraduras(){
    return this.listadoCerraduras;
  }
  public addCerradura(cerradura:any){
    this.listadoCerraduras.push(cerradura);
  }
}
