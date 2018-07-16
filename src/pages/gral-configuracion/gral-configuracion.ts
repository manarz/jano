import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HttpCommandsProvider } from '../../providers/http-commands/http-commands';

@Component({
  selector: 'page-gral-configuracion',
  templateUrl: 'gral-configuracion.html',
})
export class GralConfiguracionPage {
  public urlHost:String;
  constructor(
    public httpCommandsProv: HttpCommandsProvider,
    public alertCtrl: AlertController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.urlHost=this.httpCommandsProv.getHost();
  }

  ionViewDidLoad() {
  }

  public setearHost(){
    let prompt = this.alertCtrl.create({
      title: 'Servidor',
      message: "Ingrese la url (solo para testing)",
      inputs: [
        {
          name: 'url',
          placeholder: 'localhost:8080'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: data => {
            console.log(JSON.stringify(data));
            this.httpCommandsProv.setearHost(data);
          }
        }
      ]
    });
    prompt.present();

  }
}
