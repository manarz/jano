import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public usuariosProv:UsuariosProvider) {
    this.logout();
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
}
