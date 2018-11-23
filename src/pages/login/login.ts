import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { RegistrarsePage } from '../registrarse/registrarse';
import { AngularFireAuth } from 'angularfire2/auth';
import { CerraduraListadoPage } from '../cerradura-listado/cerradura-listado';
//import { AuthProvider, FirebaseAuth } from '@firebase/auth-types';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { Platform } from 'ionic-angular';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links';
import { LlaveListadoPage } from '../llave-listado/llave-listado';
import { LlaveCompartidaRecepcionPage } from '../llave-compartida-recepcion/llave-compartida-recepcion';
import { ResetDeClavePage } from '../reset-de-clave/reset-de-clave';

//import { FirebaseApp } from 'angularfire2';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User;
  usuario: any;
  public version: string;
  private idLlave: string;
  public isAndroid: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public usuariosProv: UsuariosProvider,
    public firebaseDynamicLinks: FirebaseDynamicLinks,
    public platform: Platform,
    public alertCtrl: AlertController
  ) {
    this.version = "1.0.3";
    this.isAndroid = this.platform.is('android') && !this.platform.is('mobileweb');
    if (this.isAndroid) {
      this.firebaseDynamicLinks.onDynamicLink()
        .subscribe(
          (res: any) => {
          if (res.deepLink)
            this.idLlave = res.deepLink.substring(res.deepLink.indexOf("/login/")+7);
            console.log('Se recibio la siguiente llave:' + this.idLlave );

          },
          (error: any) => {
            console.log("No se pudo recuperar la llave compartida" + JSON.stringify(error));
          })
    } else if (navParams.get('item') && navParams.get('item') != ':item') {
      this.idLlave=navParams.get('item');
      console.log('Se recibio la siguiente llave:' + this.idLlave );
    }
  }

  async login(user: User) {
    try {
      console.log("Intentando Login");
      await this.usuariosProv.loginConEmail((user.email)?user.email.trim():user.email, user.password);
      if(this.usuariosProv.mailNoVerificado()){
        let alert = this.alertCtrl.create({
          title: 'Bienvenido a Jano!',
          message: 'Te hemos enviado un mail a tu casilla. Verifica por favor tu cuenta y luego realiza el login.',
          buttons: [
            {
              text: 'Aceptar',
              handler: data => {
                console.log('Aceptado.');
              }
            }]
        })
        alert.present();
        this.usuariosProv.logout();
        return
      }
      console.log("Login exitoso userid:" + this.usuariosProv.getUsuario());
      this.goToHomePage();
    } catch (e) {
      console.log("Login fallido");
      let mensajeDeError: string;
      switch(e.code) { 
        case "auth/argument-error": { 
          mensajeDeError = "Verifique los datos ingresados.";
          break; 
       } 
        case "auth/invalid-email": { 
           mensajeDeError = "Email invalido";
           break; 
        } 
        case "auth/user-disabled": { 
           mensajeDeError = "El usuario se encuentra deshabilitado."
           break; 
        } 
        case "auth/user-not-found": { 
          mensajeDeError = "Usuario o Password incorrecto."
          break; 
        } 
        case "auth/wrong-password": { 
          mensajeDeError = "Usuario o Password incorrecto."
          break; 
        } 
        default: { 
           mensajeDeError = e.code
           break; 
        } 
     } 
     let alert = this.alertCtrl.create({
      title: 'Login:',
      message: mensajeDeError,
      buttons: ['Ok']
    });
    alert.present();

    }
  }
  registrar() {
    this.navCtrl.push(RegistrarsePage);
  }
  irAResetDeClave(){
    this.navCtrl.push(ResetDeClavePage);
  }
  goToHomePage() {
    if(this.idLlave){
      this.navCtrl.setRoot(LlaveCompartidaRecepcionPage, {info: this.idLlave} );
    } else {
      this.navCtrl.setRoot(LlaveListadoPage);
    }
  }
  async signInWithGoogle() {
    console.log('Sign in with google');
    await this.usuariosProv.loginConGoogle();
    if (this.usuariosProv.getUsuario()) {
      this.goToHomePage();
    }
  }
}