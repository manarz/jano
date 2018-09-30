import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public usuariosProv: UsuariosProvider,
    public firebaseDynamicLinks: FirebaseDynamicLinks,
    public plt: Platform
  ) {
    this.version = "0.2.8";
    if (this.plt.is('android')) {
      this.firebaseDynamicLinks.onDynamicLink()
        .subscribe(
          (res: any) => {
          if (res.deepLink)
            this.idLlave = res.deepLink.substring(res.deepLink.indexOf("/login/")+7);
            console.log('Se recibio la siguiente llave:' + this.idLlave );
          },
          (error: any) => {
            alert("No se pudo recuperar la llave compartida" + JSON.stringify(error));
          })
    } else if (navParams.get('item') && navParams.get('item') != ':item') {
      this.idLlave=navParams.get('item');
      console.log('Se recibio la siguiente llave:' + this.idLlave );
    }
  }

  async login(user: User) {
    try {
      console.log("Intentando Login");
      await this.usuariosProv.loginConEmail(user.email, user.password);
      console.log("Login exitoso userid:" + this.usuariosProv.getUsuario());
      this.goToHomePage();
    } catch (e) {
      console.log("Login fallido");
      console.log(e);
      alert(e.message);
    }
  }
  registrar() {
    this.navCtrl.push(RegistrarsePage);
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