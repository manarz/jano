import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-llave-configuracion',
  templateUrl: 'llave-configuracion.html',
})
export class LlaveConfiguracionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LlaveConfiguracionPage');
  }

}
