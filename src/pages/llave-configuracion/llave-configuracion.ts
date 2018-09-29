import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Llave } from '../../models/llave';
import { LlavesProvider } from '../../providers/llaves/llaves';

@Component({
  selector: 'page-llave-configuracion',
  templateUrl: 'llave-configuracion.html',
})
export class LlaveConfiguracionPage {
  private llave: Llave;
  constructor(public navCtrl: NavController, public navParams: NavParams, public llavesProv:LlavesProvider) {
    console.log("Llave configuracion, data recibida:", navParams.get('info'));
    this.llave=navParams.get('info');
  }
  public modificarLlave(){
    console.log("Intentando modificar llave",this.llave);
    this.llavesProv.modificarLlave(this.llave);
  }


}
