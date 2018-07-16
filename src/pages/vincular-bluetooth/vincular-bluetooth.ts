import { Component, NgZone } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-vincular-bluetooth',
  templateUrl: 'vincular-bluetooth.html',
})
export class VincularBluetoothPage {
  dispositivosVisibles: any;
  gettingDevices: Boolean;
  statusMessage: string;
  conectado:Boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public bluetoothSerial: BluetoothSerial,
    public alertCtrl: AlertController,
    public ngZone: NgZone
  ) {
    bluetoothSerial.enable();
    this.conectado = false;
    this.dispositivosVisibles = null;
  }
  startScanning() {
    this.dispositivosVisibles = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired()
        .then(
          (success) => {
        this.dispositivosVisibles = success;
        this.gettingDevices = false;
        /*success.forEach(element => {
          // alert(element.name);
        })*/
        },
          (err) => {
          alert(JSON.stringify(err));
        })
  }
  conexionExitosa = (data) => {   
     this.conectado = true;
     alert(data);
  }
  conexionFallida = (error) => alert(error);

  selectDevice(address: any) {

    let alert = this.alertCtrl.create({
      title: 'Conectar',
      message: 'Quiere conectarse a este dispositivo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Conectar',
          handler: () => {
            this.bluetoothSerial.connect(address)
            .subscribe( this.conexionExitosa, this.conexionFallida );
          }
        }
      ]
    });
    alert.present();

  }

  disconnect() {
    let alert = this.alertCtrl.create({
      title: 'Desconectar',
      message: 'Desea desconectar este dispositivo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Desconectar',
          handler: () => {
            this.bluetoothSerial.disconnect();
            this.conectado=false;
          }
        }
      ]
    });
    alert.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactoPage');
  }


}
