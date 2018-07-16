import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';

@Injectable()
export class SmsProvider {

  constructor(public smsProv: SMS, public alertCtrl: AlertController) {
  }

  public toogleStatusCerradura(cerradura){
    this.smsProv.send(cerradura.celular, cerradura.estaAbierta ? 'CERRAR' : 'ABRIR' )
    .then(()=>{
      let alert = this.alertCtrl.create({
        title: 'Mensaje enviado',
        message: 'Mensaje enviado con exito',
        buttons: ['Ok']
      });
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
}
