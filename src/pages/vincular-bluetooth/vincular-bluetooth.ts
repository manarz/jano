import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Llave } from '../../models/llave';
import { LlavesProvider } from '../../providers/llaves/llaves';
import { EventosCerradura } from '../../models/eventosCerradura';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { EventosProvider } from '../../providers/eventos/eventos';

@Component({
  selector: 'page-vincular-bluetooth',
  templateUrl: 'vincular-bluetooth.html',
})
export class VincularBluetoothPage implements OnInit, OnDestroy {
  dispositivosVisibles: any;
  gettingDevices: Boolean;
  statusMessage: string;
  puedeEnviarComando: boolean;
  conectado: Boolean;
  llave: Llave;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public bluetoothSerial: BluetoothSerial,
    public alertCtrl: AlertController,
    public ngZone: NgZone,
    public llavesProv: LlavesProvider,
    public usuariosProv: UsuariosProvider,
    public eventosProv: EventosProvider
  ) {
    console.log("Vinculacion de bluetooth, data recibida:", navParams.get('info'));
    this.llave = navParams.get('info');
    if (this.llave.bluetoothDevice && this.llave.bluetoothDevice.address) {
      this.puedeEnviarComando = true;
    }
  }
  ngOnInit(): void {
    this.conectado = false;
    this.bluetoothSerial.enable().then(() => {
      this.setStatus("Buscando dispositivos ...");
      this.startScanning();
    })
      .catch(e => {
        alert("Error activando bluetooth: " + e)
      });

  }
  ngOnDestroy(): void {
    if (this.conectado)
      this.bluetoothSerial.disconnect();
  }

  startScanning() {
    this.setStatus("Buscando dispositivos ...");
    this.dispositivosVisibles = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired()
      .then((dispositivos) => {
        this.setStatus("Busqueda finalizada");
        this.dispositivosVisibles = dispositivos;
        this.gettingDevices = false;
      },
      (err) => {
        this.setStatus("Busqueda finalizada");
        alert(JSON.stringify(err));
      })
  }
  esDispositivoAsociado(dispositivo: any) {
    return this.llave.bluetoothDevice && this.llave.bluetoothDevice.address == dispositivo.address;
  }
  setearDispositivo(dispositivo: any) {
    this.llave.bluetoothDevice = dispositivo;
    this.llavesProv.modificarLlave(this.llave);

    let alert = this.alertCtrl.create({
      title: 'Vinculacion exitosa',
      message: 'Dispositivo '+dispositivo.name? dispositivo.name: dispositivo.address +' asociado con exito.' ,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();

  }
  public disconnect() {
    this.bluetoothSerial.disconnect()
    .then(() => {
      this.setStatus("Desconectado.");
      this.conectado = false;
    })
    .catch(e => {alert("Desconexion error: "+ e)});

  }
  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }


}
