import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { ToastController } from 'ionic-angular';
import { PruebaBleDetalleConexionPage } from '../prueba-ble-detalle-conexion/prueba-ble-detalle-conexion';


@Component({
  selector: 'page-prueba-ble-listar-dispositivos',
  templateUrl: 'prueba-ble-listar-dispositivos.html',
})
export class PruebaBleListarDispositivosPage {
  devices: any[] = [];
  statusMessage: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public ngZone: NgZone,
    public ble: BLE
  ) {
  }

  ionViewDidLoad() {
    console.log('Inicio pagina cargada');
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  scan() {
    this.setStatus('Escaneando dispositivos Bluetooth LE');
    this.devices = [];  // clear list
    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device), 
      error => this.scanError(error)
    );
    setTimeout(this.setStatus.bind(this), 5000, 'Escaneo completo');
  }

  scanWithBluetoothVerification(){
    this.setStatus('Verificando estado Bluetooth');
    this.ble.isEnabled()
            .then(() => {
              this.setStatus('Bluetooth activado');
              this.scan();
            })
            .catch(() => {
              this.setStatus('Activando bluetooth');
              this.ble.enable().then(() => this.scan());
            });
  }




  onDeviceDiscovered(device) {
    console.log('Reconocido: ' + JSON.stringify(device, null, 2));
    //this.mostrarToast('Reconocido: ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }
  mostrarToast(msg:string){
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }
  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
    this.mostrarToast('Error scaneando dispositivos Bluetooth low energy');
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    this.navCtrl.push(PruebaBleDetalleConexionPage, {
      device: device
    });
  }



}
