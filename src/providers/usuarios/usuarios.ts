import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'; 
import firebase from 'firebase/app';

@Injectable()
export class UsuariosProvider {
  private usuario: any;
  providerGg: firebase.auth.GoogleAuthProvider;
  public unsubscribe;
  constructor(public http: HTTP, private afAuth: AngularFireAuth) {
    this.providerGg = new firebase.auth.GoogleAuthProvider();
  }
  async loginConEmail(email, password){
    const result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    console.log(result);
    this.usuario=result.user;
  }
  loginConGoogle(){

      if (!(<any>window).cordova) {
        console.log("Autenticacion con cordova plugin");
        return this.afAuth.auth.signInWithPopup(this.providerGg).then( result => {
          this.usuario = result.user;
          console.log("Autenticacion exitosa:"+this.usuario.uid);
          console.log(result);
        }).catch(function(error) {
          alert(error.message);
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
          }).catch(function(error) {
            alert(error.message);
          });
        });
      }
  }
  getUsuario(){
    if(this.usuario){
      return this.usuario.uid;
    }
    return 'TJGuSY13thdL1CFaiXjOyEfzk7k1';
  }
  async logout(){
    if(this.usuario){
      console.log("Logout userid: "+ this.usuario.uid );
      const result = await this.afAuth.auth.signOut();
      this.usuario=null;
      this.unsubscribe();
      console.log("Logout exitoso" );
      console.log(result);
      
    } else{
      console.log("No se puede hacer logout!, el userid esta vacio.");
    }
  }

}
