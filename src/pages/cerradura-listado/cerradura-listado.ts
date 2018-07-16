import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'; 

import { HTTP } from '@ionic-native/http';
import { HttpCommandsProvider } from '../../providers/http-commands/http-commands';

import { NavController, NavParams, AlertController, Item, ItemSliding  } from 'ionic-angular';
import { CerradurasProvider } from '../../providers/cerraduras/cerraduras';
import { SmsProvider } from '../../providers/sms/sms';

import { CerraduraAltaPage } from '../cerradura-alta/cerradura-alta';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-cerradura-listado',
  templateUrl: 'cerradura-listado.html',
})
export class CerraduraListadoPage {
  public listadoCerraduras: any[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public http: HTTP,
    public alertCtrl: AlertController,
    public cerradurasProv: CerradurasProvider,
    public httpCommandsProv: HttpCommandsProvider,
    public smsCommandsProv: SmsProvider,
    private afAuth:AngularFireAuth
  ) {
    this.listadoCerraduras = this.cerradurasProv.getCerraduras();
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
    this.httpCommandsProv.toogleStatusCerradura(cerradura);
  }
  public toogleAperturaSms(cerradura){
    this.smsCommandsProv.toogleStatusCerradura(cerradura);
  }
  public toogleAperturaBluetooth(cerradura){

  }
  public async logout(){
    try{
      const result = await this.afAuth.auth.signOut();
      console.log("Logout exitoso" );
      console.log(result);
      this.goToLogin();
    } catch(e){
      console.log("Login fallido");
      console.log(e);
    }
  }
  public goToLogin(){
    this.navCtrl.setRoot(LoginPage);
  }
}
