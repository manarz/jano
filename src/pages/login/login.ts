import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { RegistrarsePage } from '../registrarse/registrarse';
import { AngularFireAuth } from 'angularfire2/auth'; 
import { CerraduraListadoPage } from '../cerradura-listado/cerradura-listado';
import { AuthProvider, FirebaseAuth } from '@firebase/auth-types';
import { FirebaseApp } from 'angularfire2';
import firebase from 'firebase/app';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User;
  providerGg: firebase.auth.GoogleAuthProvider;  
  usuario:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private afAuth: AngularFireAuth){
                this.providerGg = new firebase.auth.GoogleAuthProvider();
  }
  async login(user: User){
    try{
      console.log("Intentando Login");
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      this.usuario = result.user;
      console.log("Login exitoso userid:" + this.usuario.uid );
      console.log(result);
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
  signInWithGoogle() {
		console.log('Sign in with google');
		return this.oauthSignIn();
}

private oauthSignIn() {
	if (!(<any>window).cordova) {
    console.log("Autenticacion con cordova plugin");
		return this.afAuth.auth.signInWithPopup(this.providerGg).then( result => {
      this.usuario = result.user;
      console.log("Autenticacion exitosa:"+this.usuario.uid);
      console.log(result);
      this.goToHomePage();
    });
	} else {
    console.log("Autenticacion sin cordova plugin: no esta probado");
		return this.afAuth.auth.signInWithRedirect(this.providerGg)
		.then(() => {
      console.log("Autenticacion exitosa");
			return this.afAuth.auth.getRedirectResult().then( result => {
				// This gives you a Google Access Token.
				// You can use it to access the Google API.
				let token = result.credential.accessToken;
				// The signed-in user info.
				let user = result.user;
        console.log(token, user);
        this.goToHomePage();
			}).catch(function(error) {
				// Handle Errors here.
				alert(error.message);
			});
		});
	}
}
}