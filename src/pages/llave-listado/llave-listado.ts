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
    public plt: Platform
  ) {
    this.isAndroid = this.plt.is('android');
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
    this.navCtrl.push(VincularBluetoothPage, {info:llave});
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
    nuevaLlave.esAdministrador=false;
    nuevaLlave.nombreFamiliar='Copia de '+nuevaLlave.nombreFamiliar;
    console.log('Intentando ir a llave a compartir', nuevaLlave);
    this.navCtrl.push(LlaveACompartirConfiguracionPage, { info: nuevaLlave });
  }
}
