import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-registrarse',
  templateUrl: 'registrarse.html',
})
export class RegistrarsePage {
  user = {} as User;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    public alertCtrl: AlertController
  ) {
  }
  registrar() {
    if (this.user.password != this.user.passwordVerificacion) {
      let alert = this.alertCtrl.create({
        title: 'Verificar datos.',
        message: 'Las passwords ingresadas no coinciden.',
        buttons: [
          {
            text: 'Aceptar',
            handler: data => {
              console.log('Aceptado');
            }
          }]
      })
      alert.present();
      return
    }
    console.log("Registro de mail disparado");
    this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(result => {
        console.log("Usuario registrado");
        console.log(result);
        this.afAuth.auth.currentUser.sendEmailVerification()
          .then(() => console.log("email de verificacion enviado con exito"))
          .catch(error => console.log("No se pudo enviar email de verificacion", error));

        let alert = this.alertCtrl.create({
          title: 'Cuenta creada con éxito.',
          message: 'Te hemos enviado un mail a tu casilla. Verifica por favor tu cuenta y luego realiza el login.',
          buttons: [
            {
              text: 'Aceptar',
              handler: data => {
                console.log('Aceptado. Volviendo al login.');
                this.navCtrl.pop();
              }
            }]
        })
        alert.present();
        
      })
      .catch(e => {
        console.log("Usuario NO registrado", e);
        let mensajeDeError: string;
        switch (e.code) {
          case "auth/invalid-email": {
            mensajeDeError = "Email invalido";
            break;
          }
          case "auth/email-already-in-use": {
            mensajeDeError = "El email ya se encuentra registrado."
            break;
          }
          case "auth/weak-password": {
            mensajeDeError = " Password muy débil."
            break;
          }
          default: {
            mensajeDeError = e.code
            break;
          }
        }
        let alert = this.alertCtrl.create({
          title: 'Usuario no registrado:',
          message: mensajeDeError,
          buttons: ['Ok']
        });
        alert.present();
      })
  }
  goToLoginPage() {
    this.navCtrl.setRoot(LoginPage);
  }
}
