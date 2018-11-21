import { Component, OnInit, OnDestroy } from '@angular/core';

import { HTTP } from '@ionic-native/http';

import { NavController, NavParams, AlertController, Item, ItemSliding, Platform  } from 'ionic-angular';
import { CerradurasProvider } from '../../providers/cerraduras/cerraduras';
import { SmsProvider } from '../../providers/sms/sms';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

import { CerraduraAltaPage } from '../cerradura-alta/cerradura-alta';
import { LoginPage } from '../login/login';
import { LlavesProvider } from '../../providers/llaves/llaves';
import { Subscription } from 'rxjs';
import { Cerradura } from '../../models/cerradura';
import { Llave } from '../../models/llave';
import { LlavePrestadaConfiguracionPage } from '../llave-prestada-configuracion/llave-prestada-configuracion';
import { LlaveConfiguracionPage } from '../llave-configuracion/llave-configuracion';
import { LlaveACompartirConfiguracionPage } from '../llave-a-compartir-configuracion/llave-a-compartir-configuracion';
import { VincularBluetoothPage } from '../vincular-bluetooth/vincular-bluetooth';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

@Component({
  selector: 'page-llave-listado',
  templateUrl: 'llave-listado.html',
})
export class LlaveListadoPage implements OnInit, OnDestroy {
  public listadoLlaves: any[];
  public isAndroid: boolean;
  subscriptions: Subscription[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public http: HTTP,
    public alertCtrl: AlertController,
    public llavesProv: LlavesProvider,
    public smsCommandsProv: SmsProvider,
    public usuariosProv: UsuariosProvider,
    public platform: Platform,
    public bluetoothProv: BluetoothProvider
  ) {
    this.isAndroid = this.platform.is('android') && !this.platform.is('mobileweb');
  }
  ngOnInit(): void {
    this.subscriptions=[];
    this.subscriptions.push(
      this.llavesProv.obtenerLlavesPropias(this.usuariosProv.getUsuario()).subscribe(listado => this.listadoLlaves = listado)
    );
  }
  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }


  public openOption(itemSlide: ItemSliding) {
    let swipeAmount=350;

    itemSlide.startSliding(swipeAmount);
    itemSlide.moveSliding(swipeAmount);
    
    itemSlide.setElementClass('active-options-right', true);
    itemSlide.setElementClass('active-swipe-right', true);

    //item.setElementStyle('transition', null);
    //item.setElementStyle('transform', 'translate3d(-'+swipeAmount+'px, 0px, 0px)');
  }

  public toogleAperturaWifi(llave: Llave) {
    this.llavesProv.enviarComandoAperturaCierre(llave);
  }
  public toogleAperturaSms(llave: Llave){
    this.smsCommandsProv.toogleStatusCerradura(llave);
  }
  public toogleAperturaBluetooth(llave: Llave){
    if(llave.bluetoothDevice && llave.bluetoothDevice.address){
      this.bluetoothProv.enviarComandoApertura(llave);
    }else{
      this.confirmarIrAVincularBT(llave);
    }
  }
  confirmarIrAVincularBT(llave: Llave){
    let alert = this.alertCtrl.create({
      title: 'Apertura bluetooth',
      message: 'Debe vincular su teléfono a traves de bluetooth primero.',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Vincular',
        handler: () => {
          console.log('Intentando ir a Vincular Bluetooth');
          this.navCtrl.push(VincularBluetoothPage, {info:llave});
        }
      }]
    });
    alert.present();
  }

  public async logout(){
    try{
      this.usuariosProv.logout();
      this.goToLogin();
    } catch(e){
      console.log("Login fallido");
      console.log(e);
    }
  }
  puedeUtilizar(medio: string, llave: Llave){
    //console.log("VERIFICANDO SI PUEDE ENVIAR COMANDOS");
    let dia=new Date();
    let tiempoHabilitado=true;
    let dVigenciaDesde=(llave.vigenciaDesde)? new Date(llave.vigenciaDesde+" "): new Date(dia.getFullYear(),dia.getMonth(),dia.getDate()-1);
    tiempoHabilitado=(llave.vigenciaDesde == null || dVigenciaDesde <= dia) && tiempoHabilitado 
    //console.log("vigenciaDesde: "+dVigenciaDesde+", tiempoHabilitado"+tiempoHabilitado);

    let dVigenciaHasta=(llave.vigenciaHasta)? new Date(llave.vigenciaHasta+" "): new Date(dia.getFullYear(),dia.getMonth(),dia.getDate()+1);
    tiempoHabilitado=(llave.vigenciaHasta == null || dVigenciaHasta >= dia) && tiempoHabilitado 
    //console.log("vigenciaHasta: "+dVigenciaHasta+", tiempoHabilitado"+tiempoHabilitado);

    let dFranjaHorariaDesde=new Date(dia.getFullYear(),dia.getMonth(),dia.getDate(), llave.franjaHorariaDesde?Number(llave.franjaHorariaDesde.substring(0,2)):0,llave.franjaHorariaDesde?Number(llave.franjaHorariaDesde.substring(3)):0,0);
    tiempoHabilitado=dFranjaHorariaDesde <= dia && tiempoHabilitado 
    //console.log("franjaHorariaDesde: "+dFranjaHorariaDesde+", tiempoHabilitado"+tiempoHabilitado);

    let dFranjaHorariaHasta=new Date(dia.getFullYear(),dia.getMonth(),dia.getDate(), llave.franjaHorariaHasta?Number(llave.franjaHorariaHasta.substring(0,2)):23,llave.franjaHorariaHasta?Number(llave.franjaHorariaHasta.substring(3)):59,59);
    tiempoHabilitado=dFranjaHorariaHasta >= dia && tiempoHabilitado 
    //console.log("franjaHorariaHasta: "+dFranjaHorariaHasta+", tiempoHabilitado"+tiempoHabilitado);

    let vigenciaDiasHoyPuede=llave.vigenciaDias[this.obtenerDiaDeLaSemana()]
    tiempoHabilitado=vigenciaDiasHoyPuede && tiempoHabilitado
    //console.log("vigenciaDiasHoyPuede:"+vigenciaDiasHoyPuede+", tiempoHabilitado"+tiempoHabilitado);

    switch(medio){
      case 'wifi': {return tiempoHabilitado}
      case 'sms': {return tiempoHabilitado&&this.isAndroid&&llave.aperturaOffline}
      case 'bluetooth': {return tiempoHabilitado&&this.isAndroid&&llave.aperturaOffline}
    }
  }
  obtenerDiaDeLaSemana(){
    let dias=['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
    let d=new Date();
    let weekday=dias[d.getDay()]
    //console.log("Hoy es: " + weekday);
    return weekday;
  }
  public goToLogin(){
    this.navCtrl.setRoot(LoginPage);
  }
  public irALlaveAdministradorConfiguracion(llave: Llave){
    console.log('Intentando ir a configuracion de llave.', llave);
    if(llave.esAdministrador){
      this.navCtrl.push(LlaveConfiguracionPage, { info: llave });
    }else{
      this.navCtrl.push(LlavePrestadaConfiguracionPage, { info: llave });
    }
  }
  public irACompartirLlave(llave: Llave){
    let nuevaLlave = <Llave>{...llave}
    nuevaLlave.id='';
    nuevaLlave.dueño='';
    nuevaLlave.email=null;
    nuevaLlave.esAdministrador=false;
    nuevaLlave.nombreFamiliar='Copia de '+nuevaLlave.nombreFamiliar;
    console.log('Intentando ir a llave a compartir', nuevaLlave);
    this.navCtrl.push(LlaveACompartirConfiguracionPage, { info: nuevaLlave });
  }
}
