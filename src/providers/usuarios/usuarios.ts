import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';
import { Platform } from 'ionic-angular';

@Injectable()
export class UsuariosProvider {
  private usuario: any;
  providerGg: firebase.auth.GoogleAuthProvider;
  constructor(public http: HTTP, private afAuth: AngularFireAuth, public platform: Platform) {
    this.providerGg = new firebase.auth.GoogleAuthProvider();
  }
  async loginConEmail(email, password) {
    const result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    console.log(result);
    this.usuario = result.user;
  }
  public mailNoVerificado(){
    return !this.afAuth.auth.currentUser.emailVerified
  }
  validarCuenta(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  eliminarCuenta() {
    this.logout()
    console.log("Eliminacion de cuenta en progreso.")
    this.afAuth.auth.currentUser.delete().then(() => {
      console.log("Usuario eliminado con exito");
    }).catch(error => {
      console.log("Error al eliminar usuario")
    })
  }
  loginConGoogle() {
    if (this.platform.is('android') && !this.platform.is('mobileweb')) {
      console.log("Autenticacion sin cordova plugin: no esta probado");
      return this.afAuth.auth.signInWithRedirect(this.providerGg)
        .then(() => {
          console.log("Autenticacion exitosa");
          return this.afAuth.auth.getRedirectResult().then(result => {
            // This gives you a Google Access Token.
            // You can use it to access the Google API.
            let token = result.credential.accessToken;
            // The signed-in user info.
            let user = result.user;
            console.log(token, user);
          }).catch(function (error) {
            alert(error.message);
          });
        });
    } else {
      console.log("Autenticacion web");
      return this.afAuth.auth.signInWithPopup(this.providerGg).then(result => {
        this.usuario = result.user;
        console.log("Autenticacion exitosa:" + this.usuario.uid);
        console.log(result);
      }).catch(function (error) {
        alert(error.message);
      });
    }
  }
  nombreDeUsuario() {
    return (firebase.auth().currentUser) ? firebase.auth().currentUser.email : 'jano@mail.com'
  }

  getUsuario() {
    if (this.usuario) {
      return this.usuario.uid;
    }
    return 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
  }
  async logout() {
    if (this.usuario) {
      console.log("Logout userid: " + this.usuario.uid);
      const result = await this.afAuth.auth.signOut();
      this.usuario = null;
      console.log("Logout exitoso");
      console.log(result);

    } else {
      console.log("No se puede hacer logout!, el userid esta vacio.");
    }
  }

}
