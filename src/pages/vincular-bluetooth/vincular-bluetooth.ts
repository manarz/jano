import { Component, NgZone } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Llave } from '../../models/llave';
import { LlavesProvider } from '../../providers/llaves/llaves';

@Component({
  selector: 'page-vincular-bluetooth',
  templateUrl: 'vincular-bluetooth.html',
})
export class VincularBluetoothPage {
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
    public llavesProv: LlavesProvider
  ) {
    console.log("Vinculacion de bluetooth, data recibida:", navParams.get('info'));
    this.llave = navParams.get('info');
    if (this.llave.bluetoothDevice && this.llave.bluetoothDevice.address) {
      this.puedeEnviarComando = true;
    }
  }
  ngOnInit(): void {
    this.bluetoothSerial.enable();
    this.conectado = false;
    this.setStatus("Buscando dispositivos ...");
    this.startScanning();
  }
  ngOnDestroy(): void {
    if (this.conectado)
      this.bluetoothSerial.disconnect();
  }

  startScanning() {
    this.dispositivosVisibles = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired()
      .then((dispositivos) => {
        this.dispositivosVisibles = dispositivos;
        this.gettingDevices = false;
      },
        (err) => {
          alert(JSON.stringify(err));
        })
  }
  public enviarComandoApertura() {
      this.setStatus("Intentando conexión a " + this.llave.bluetoothDevice.name + "...");
      this.bluetoothSerial.connect(this.llave.bluetoothDevice.address)
        .subscribe(
          //conexion exitosa
          (data) => {
            this.conectado = true;
            this.puedeEnviarComando = true;
            this.setStatus("Conectado.");
            let comando = this.llavesProv.obtenerComandoAperturaCierre(this.llave);
            this.bluetoothSerial.write(comando)
              .then(data => {
                alert('Exito tx ' + comando + JSON.stringify(data));
                this.disconnect();
              })
              .catch(err => alert('Error tx ' + comando + JSON.stringify(err)));
          }, 
          //conexion fallida
          (error) => alert(error) 
        );
  }
  esDispositivoAsociado(dispositivo: any) {
    return this.llave.bluetoothDevice && this.llave.bluetoothDevice.address == dispositivo.address;
  }
  setearDispositivo(dispositivo: any) {
    this.llave.bluetoothDevice = dispositivo;
    this.llavesProv.modificarLlave(this.llave);

    let alert = this.alertCtrl.create({
      title: 'Probar comando',
      message: 'Quiere probar la conexión ' + this.llave.estado == 'ABR' ? 'cerrando' : 'abriendo' + ' este dispositivo?\n' + JSON.stringify(dispositivo),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Probar ' + this.llave.estado == 'ABR' ? 'cierre' : 'apertura',
          handler: () => {
            this.enviarComandoApertura();
          }
        }
      ]
    });
    alert.present();

  }
  public disconnect() {
    this.bluetoothSerial.disconnect();
    this.setStatus("Desconectado.");
    this.conectado = false;
  }
  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }


}
