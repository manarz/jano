import { Component , NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

@Component({
  selector: 'page-prueba-ble-detalle-conexion',
  templateUrl: 'prueba-ble-detalle-conexion.html',
})
export class PruebaBleDetalleConexionPage {
  peripheral: any = {};
  statusMessage: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public ble: BLE,
    public toastCtrl: ToastController,
    public ngZone: NgZone
  ) {
    let device = navParams.get('device');

    if(device){
      this.setStatus('Verificando estado Bluetooth');

      this.ble.isEnabled()
              .then(() => {
                this.setStatus('Bluetooth activado');
                this.conectarDispositivo(device);
              })
              .catch(() => {
                this.setStatus('Activando bluetooth');
                this.ble.enable().then(() => this.conectarDispositivo(device));
              });
    }
  }
  conectarDispositivo(device){
      this.setStatus('Conectando a ' + device.id);
      this.ble.connect(device.id).subscribe(
        peripheral => this.conexionExitosa(peripheral),
        peripheral => this.conexionFallida(peripheral)
      );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilesPage');
  }
  
  conexionExitosa(peripheral) {
    this.ngZone.run(() => {
      this.setStatus('Conectado');
      this.peripheral = peripheral;
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
  
  conexionFallida(peripheral) {
    this.setStatus('Conexion fallida');
    this.mostrarToast('El periferico no se ha podido conectar. Reintente.'+JSON.stringify(this.peripheral));  
  }
  // Disconnect peripheral when leaving the page
  ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
}
