import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';


@Component({
  selector: 'page-prueba-envio-sms',
  templateUrl: 'prueba-envio-sms.html',
})
export class PruebaEnvioSmsPage {
  data:{numero:string,mensaje:string };
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sms: SMS,
    private alertCtrl: AlertController
  ) {
    this.data = { numero:"", mensaje:"" };
  }
  enviarSMS() {
    this.sms.send(this.data.numero,this.data.mensaje)
    .then(()=>{
      let alert = this.alertCtrl.create({
        title: 'Mensaje enviado',
        message: 'Mensaje enviado con exito',
        buttons: ['Ok']
      });
      this.data = { numero:"", mensaje:"" };
      alert.present();
    })
    .catch(()=>{
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'No se ha podido enviar el mensaje!',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AcercaPage');
  }

}
