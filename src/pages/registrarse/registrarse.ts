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
  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth) {
  }
  registrar() {
    console.log("Registro de mail disparado");
    this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(result => {
        console.log("Usuario registrado");
        console.log(result);
        this.navCtrl.pop();
      })
      .catch(e => {
        console.log("Usuario NO registrado");
        alert("Usuario no registrado: "+ e);
      })
  }
  goToLoginPage() {
    this.navCtrl.setRoot(LoginPage);
  }
}
