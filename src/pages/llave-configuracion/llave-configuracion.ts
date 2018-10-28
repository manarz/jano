import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Llave } from '../../models/llave';
import { LlavesProvider } from '../../providers/llaves/llaves';
import { VincularBluetoothPage } from '../vincular-bluetooth/vincular-bluetooth';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

@Component({
  selector: 'page-llave-configuracion',
  templateUrl: 'llave-configuracion.html',
})
export class LlaveConfiguracionPage {
  public llave: Llave;
  public tiempoLimitado: boolean;
  public isAndroid: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public llavesProv: LlavesProvider, public usuariosProv: UsuariosProvider, public platform: Platform) {
    console.log("Llave configuracion, data recibida:", navParams.get('info'));
    this.llave = navParams.get('info');
    this.isAndroid = this.platform.is('android')&& !this.platform.is('mobileweb');
    this.tiempoLimitado = false
    this.tiempoLimitado = this.tiempoLimitado || Boolean(this.llave.vigenciaDesde)
    this.tiempoLimitado = this.tiempoLimitado || Boolean(this.llave.vigenciaHasta)
    this.tiempoLimitado = this.tiempoLimitado || Boolean(this.llave.franjaHorariaDesde) 
    this.tiempoLimitado = this.tiempoLimitado || Boolean(this.llave.franjaHorariaHasta)
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.domingo
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.lunes
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.martes
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.miercoles
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.jueves
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.viernes
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.sabado
  }
  public puedeVincularBluetooth(){
    let puedeVincularbt=this.isAndroid && this.llave.aperturaOffline && this.llave.dueño==this.usuariosProv.getUsuario()
    return puedeVincularbt;
  }
  public esDuenioDeLlave(){
    return this.llave.dueño==this.usuariosProv.getUsuario()
  }
  public resetTiempoLimitado() {
    if(!this.tiempoLimitado){
      this.llave.vigenciaDesde = null
      this.llave.vigenciaHasta = null
      this.llave.franjaHorariaDesde = null
      this.llave.franjaHorariaHasta = null
      this.llave.vigenciaDias.domingo = true;
      this.llave.vigenciaDias.lunes = true;
      this.llave.vigenciaDias.martes = true;
      this.llave.vigenciaDias.miercoles = true;
      this.llave.vigenciaDias.jueves = true;
      this.llave.vigenciaDias.viernes = true;
      this.llave.vigenciaDias.sabado = true;
    }
  }
  public modificarLlave() {
    console.log("Intentando modificar llave", this.llave);
    this.llavesProv.modificarLlave(this.llave);
    this.navCtrl.pop();
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
