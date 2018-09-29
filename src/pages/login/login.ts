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
import { AppVersion } from '@ionic-native/app-version';

//import { FirebaseApp } from 'angularfire2';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User;
  usuario: any;
  public version: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public usuariosProv: UsuariosProvider,
    public firebaseDynamicLinks: FirebaseDynamicLinks,
    public plt: Platform,
    public appVersion: AppVersion
  ) {
    if (this.plt.is('android')) {
      this.appVersion.getVersionCode().then((data) => this.version=data
    ).catch(err=>console.log('Error al obtener la version'+err));
    this.version="w.0.2.6";
      this.firebaseDynamicLinks.onDynamicLink()
        .subscribe((res: any) => alert(JSON.stringify(res)), (error: any) => alert(JSON.stringify(error)))
    } else alert(navParams.get('item'));
    
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
    this.navCtrl.setRoot(CerraduraListadoPage);
  }
  async signInWithGoogle() {
    console.log('Sign in with google');
    await this.usuariosProv.loginConGoogle();
    if (this.usuariosProv.getUsuario()) {
      this.goToHomePage();
    }
  }
}