import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth'; 
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-registrarse',
  templateUrl: 'registrarse.html',
})
export class RegistrarsePage {
  user = {} as User;
  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth:AngularFireAuth) {
  }
 async registrar(user: User){
    try{
      console.log("Registro de mail disparado");
      const result= await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      console.log("Usuario registrado");
      console.log(result);

    }
    catch(e){
      console.log("Usuario NO registrado");
      console.log(e);
    }
  }
  goToLoginPage(){
    this.navCtrl.setRoot(LoginPage);
  }
}
