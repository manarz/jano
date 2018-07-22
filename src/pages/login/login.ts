import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { RegistrarsePage } from '../registrarse/registrarse';
import { AngularFireAuth } from 'angularfire2/auth'; 
import { CerraduraListadoPage } from '../cerradura-listado/cerradura-listado';
//import { AuthProvider, FirebaseAuth } from '@firebase/auth-types';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

//import { FirebaseApp } from 'angularfire2';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User;
  usuario:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public usuariosProv: UsuariosProvider){
  }
  async login(user: User){
    try{
      console.log("Intentando Login");
      await this.usuariosProv.loginConEmail(user.email, user.password);
      console.log("Login exitoso userid:" + this.usuariosProv.getUsuario()  );
      this.goToHomePage();
    } catch(e){
      console.log("Login fallido");
      console.log(e);
      alert(e.message);
    }
  }
  registrar(){
    this.navCtrl.push(RegistrarsePage);
  }
  goToHomePage(){
    this.navCtrl.setRoot(CerraduraListadoPage);
  }
  async signInWithGoogle() {
		console.log('Sign in with google');
    await this.usuariosProv.loginConGoogle();
    if(this.usuariosProv.getUsuario()){
        this.goToHomePage();
    }
  }
}