import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RedListadoPage } from '../red-listado/red-listado';
import { Cerradura } from '../../models/cerradura';


@Component({
  selector: 'page-cerradura-configuracion',
  templateUrl: 'cerradura-configuracion.html',
})

export class CerraduraConfiguracionPage {
  private cerradura: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("Configuracion de cerradura, data recibida:",navParams.get('info'));
    this.cerradura=navParams.get('info');
  }

  public irAdministrarWifi(){
    console.log("Redirigiendo al listado de redes.",this.cerradura);
    this.navCtrl.push(RedListadoPage, {info: this.cerradura});
  }
  public irANumerosDeConfianza(){
    console.log("Redirigiendo al listado de numeros de confianza.");
//    this.navCtrl.push(RedListadoPage);
  }
}
