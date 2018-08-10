import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RedListadoPage } from '../red-listado/red-listado';


@Component({
  selector: 'page-cerradura-configuracion',
  templateUrl: 'cerradura-configuracion.html',
})

export class CerraduraConfiguracionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public irAdministrarWifi(){
    console.log("Redirigiendo al listado de redes.");
    this.navCtrl.push(RedListadoPage);
  }
  public irANumerosDeConfianza(){
    console.log("Redirigiendo al listado de numeros de confianza.");
//    this.navCtrl.push(RedListadoPage);
  }
}
