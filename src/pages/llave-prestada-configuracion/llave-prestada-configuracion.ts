import { Component } from '@angular/core';
import {  NavController, NavParams, Platform } from 'ionic-angular';
import { Llave } from '../../models/llave';
import { LlavesProvider } from '../../providers/llaves/llaves';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { VincularBluetoothPage } from '../vincular-bluetooth/vincular-bluetooth';

@Component({
  selector: 'page-llave-prestada-configuracion',
  templateUrl: 'llave-prestada-configuracion.html',
})
export class LlavePrestadaConfiguracionPage {
  public llave: Llave;
  public isAndroid: boolean; 
  constructor(public navCtrl: NavController, public navParams: NavParams, public llavesProv:LlavesProvider, public plt: Platform, public usuariosProv: UsuariosProvider) {
    console.log("Llave prestada configuracion, data recibida:", navParams.get('info'));
    this.llave=navParams.get('info');
    this.isAndroid = this.plt.is('android')&& !this.plt.is('mobileweb');

  }
  public modificarLlave(){
    console.log("Intentando modificar llave prestada", this.llave);
    this.llavesProv.modificarLlave(this.llave);
    this.navCtrl.pop();
  }
  public puedeVincularBluetooth(){
    let puedeVincularbt=this.isAndroid && this.llave.aperturaOffline && this.llave.dueño==this.usuariosProv.getUsuario()
    return puedeVincularbt;
  }
  public irAVincularBluetooth() {
    console.log("Redirigiendo a vincular bluetooth", this.llave);
    this.navCtrl.push(VincularBluetoothPage, { info: this.llave });
  }
  public eliminarLlave(){
    this.llavesProv.eliminarLlave(this.llave);
    this.navCtrl.pop();

  }

}
