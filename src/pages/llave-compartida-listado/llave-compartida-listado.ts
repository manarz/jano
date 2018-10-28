import { Component, OnInit, OnDestroy } from '@angular/core';

import { HTTP } from '@ionic-native/http';

import { NavController, NavParams, AlertController, Item, ItemSliding  } from 'ionic-angular';
import { CerradurasProvider } from '../../providers/cerraduras/cerraduras';
import { SmsProvider } from '../../providers/sms/sms';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

import { CerraduraAltaPage } from '../cerradura-alta/cerradura-alta';
import { LlaveConfiguracionPage } from '../llave-configuracion/llave-configuracion';
import { LoginPage } from '../login/login';
import { Subscription } from 'rxjs';
import { LlavesProvider } from '../../providers/llaves/llaves';
import { Cerradura } from '../../models/cerradura';
import { Llave } from '../../models/llave';

@Component({
  selector: 'page-llave-compartida-listado',
  templateUrl: 'llave-compartida-listado.html',
})
export class LlaveCompartidaListadoPage implements OnInit, OnDestroy{
  public listadoLlaves: any[];
  public cerradura: Cerradura;
  subscriptions: Subscription[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public http: HTTP,
    public alertCtrl: AlertController,
    public llavesProv: LlavesProvider,
    public smsCommandsProv: SmsProvider,
    public usuariosProv: UsuariosProvider
  ) {
    console.log("Llave compartida listado, data recibida:",navParams.get('info'));
    this.cerradura=navParams.get('info');
  }
  ngOnInit(): void {
    this.subscriptions=[];
    this.subscriptions.push(
      this.llavesProv.obtenerLlavesCerradura(this.cerradura.id).subscribe(listado => this.listadoLlaves = listado)
    );
  }
  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }

  ionViewDidLoad() {
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

  public nuevaCerradura(){
    this.navCtrl.push(CerraduraAltaPage);
  }

  public toogleAperturaWifi(cerradura) {
    return null
  }
  public toogleAperturaSms(cerradura){
    this.smsCommandsProv.toogleStatusCerradura(cerradura);
  }
  public toogleAperturaBluetooth(cerradura){

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
  public irAConfiguracionLlave(llave: Llave){
      console.log('Redirigiendo a configuracion de llaves',llave);
      this.navCtrl.push(LlaveConfiguracionPage, {info: llave});
  }
}
