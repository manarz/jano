import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-reset-de-clave',
  templateUrl: 'reset-de-clave.html',
})
export class ResetDeClavePage {
  user = {} as User;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public afAuth: AngularFireAuth

  ) {
  }

  enviarClaveTemporal() {
    console.log('Intentando enviar mail de restablecimiento de password');
    this.afAuth.auth.sendPasswordResetEmail(this.user.email)
    .then(() => {
      let alert = this.alertCtrl.create({
        title: 'Mail de restablecimiento enviado.',
        message: 'Te hemos enviado un enlace con el cual podrás reestablecer tu contraseña. Verifica tu correo por favor y luego realiza el login con la nueva password.',
        buttons: [
          {
            text: 'Aceptar',
            handler: data => {
              console.log('Aceptado. Redirigiendo al Login.');
              this.navCtrl.pop();
            }
          }]
      })
      alert.present();
    }).catch(e => {
      console.log("Email de restablecimiento de clave no enviado", e);
      let mensajeDeError: string;
      switch (e.code) {
        case "auth/invalid-email": {
          mensajeDeError = "Email inválido. Verifique los datos por favor. ";
          break;
        }
        case "auth/user-not-found": {
          mensajeDeError = "Email inválido. Verifique los datos por favor. "
          break;
        }
        default: {
          mensajeDeError = e.code
          break;
        }
      }
      let alert = this.alertCtrl.create({
        title: 'Datos incorrectos:',
        message: mensajeDeError,
        buttons: ['Ok']
      });
      alert.present();
    })
  }
}
