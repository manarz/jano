import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import { Cerradura } from '../../models/cerradura';
import { Llave } from '../../models/llave';

@Injectable()
export class SmsProvider {

  constructor(public smsProv: SMS, public alertCtrl: AlertController) {
  }

  public toogleStatusCerradura(llave: Llave){
    this.smsProv.send(llave.telefonoCerradura, llave.idCerradura + (llave.estado=='abierta')? 'CERRAR' : 'ABRIR' )
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
