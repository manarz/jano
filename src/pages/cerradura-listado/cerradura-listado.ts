import { Component, OnInit, OnDestroy } from '@angular/core';

import { HTTP } from '@ionic-native/http';
import { HttpCommandsProvider } from '../../providers/http-commands/http-commands';

import { NavController, NavParams, AlertController, Item, ItemSliding } from 'ionic-angular';
import { CerradurasProvider } from '../../providers/cerraduras/cerraduras';
import { SmsProvider } from '../../providers/sms/sms';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

import { CerraduraAltaPage } from '../cerradura-alta/cerradura-alta';
import { CerraduraConfiguracionPage } from '../cerradura-configuracion/cerradura-configuracion';
import { LlaveCompartidaListadoPage } from '../llave-compartida-listado/llave-compartida-listado';

import { LoginPage } from '../login/login';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-cerradura-listado',
  templateUrl: 'cerradura-listado.html',
})
export class CerraduraListadoPage implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }
  public listadoCerraduras: any[];

  subscriptions: Subscription[]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HTTP,
    public alertCtrl: AlertController,
    public cerradurasProv: CerradurasProvider,
    public httpCommandsProv: HttpCommandsProvider,
    public smsCommandsProv: SmsProvider,
    public usuariosProv: UsuariosProvider
  ) { }

  ngOnInit(): void {
    this.subscriptions=[];
    this.subscriptions.push(
      this.cerradurasProv.obtenerCerraduras(this.usuariosProv.getUsuario()).subscribe(listado => this.listadoCerraduras = listado)
    );
  }
  ionViewDidLoad() {
  }
  public openOption(itemSlide: ItemSliding) {
    let swipeAmount = 350;

    itemSlide.startSliding(swipeAmount);
    itemSlide.moveSliding(swipeAmount);

    itemSlide.setElementClass('active-options-right', true);
    itemSlide.setElementClass('active-swipe-right', true);

    //item.setElementStyle('transition', null);
    //item.setElementStyle('transform', 'translate3d(-'+swipeAmount+'px, 0px, 0px)');
  }

  public nuevaCerradura() {
    this.navCtrl.push(CerraduraAltaPage);
  }

  public toogleAperturaWifi(cerradura) {
    this.httpCommandsProv.toogleStatusCerradura(cerradura);
  }
  public toogleAperturaSms(cerradura) {
    this.smsCommandsProv.toogleStatusCerradura(cerradura);
  }
  public toogleAperturaBluetooth(cerradura) {

  }
  public async logout() {
    try {
      this.usuariosProv.logout();
      this.goToLogin();
    } catch (e) {
      console.log("Logout fallido");
      console.log(e);
    }
  }
  public goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }
  public irAConfiguracionCerradura(cerradura) {
    console.log("Redirigiendo a configuracion de cerradura", cerradura);
    this.navCtrl.push(CerraduraConfiguracionPage, { info: cerradura });
  }
  public irAListadoDeCompartidas(cerradura) {
    console.log("Redirigiendo a listado de cerraduras compartidas", cerradura);
    this.navCtrl.push(LlaveCompartidaListadoPage, { info: cerradura });
  }
  public irANuevaCerradura(){
    this.navCtrl.push(CerraduraAltaPage);
  }
}
