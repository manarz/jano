import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { RedAltaPage } from '../red-alta/red-alta';
import { Red } from '../../models/red';
import { RedesProvider } from '../../providers/redes/redes';
import { Subscription } from 'rxjs';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';
import { LlavesProvider } from '../../providers/llaves/llaves';
import { Llave } from '../../models/llave';
import { VincularBluetoothPage } from '../vincular-bluetooth/vincular-bluetooth';



@Component({
  selector: 'page-red-listado',
  templateUrl: 'red-listado.html',
})
export class RedListadoPage implements OnInit, OnDestroy{
  public listadoRedes: any[];
  public cerradura:any;
  public isAndroid: boolean;
  subscriptions: Subscription[]
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public redesProv: RedesProvider,
    public bluetoothProv: BluetoothProvider,
    public llavesProv: LlavesProvider,
    public platform: Platform
  ) {
      this.isAndroid = this.platform.is('android')&& !this.platform.is('mobileweb');
      console.log("Listado de redes, data recibida:", this.navParams.get('info'));
      this.cerradura=this.navParams.get('info');
  }

  ngOnInit(): void {
    this.subscriptions=[];
    this.redesProv.getRedes(this.cerradura);
    this.subscriptions.push(
      this.redesProv.listadoRedes$.subscribe(listado => this.listadoRedes = listado)
    );
  }
  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }

  irANuevaRed(){
    this.navCtrl.push(RedAltaPage, { info: this.cerradura });
  }
  eliminarRed(red: Red){
    console.log('Intentando eliminar red', red);
    this.redesProv.eliminarRed(red);
  }
  sincronizarRed(red: Red){
    console.log('Intentando sincronizar red', red);
    this.llavesProv.obtenerLlaveDueñoCerradura(this.cerradura)
    .then(querySnapshot=>{
      let llave:Llave;
      querySnapshot.forEach(            
      doc => {
        llave={...doc.data(), id: doc.id};
        console.log('Llave del dueño obtenida', llave);
      })
      if (llave) {
          if(llave.bluetoothDevice && llave.bluetoothDevice.address){
            console.log('Se puede enviar comando al address: ' + llave.bluetoothDevice.address)
            this.bluetoothProv.sincronizarRed(this.cerradura, red, llave);
          }else{
            this.confirmarIrAVincularBT(llave);
          } 
      } else {
          // doc.data() will be undefined in this case
          alert("Debe tener llave para esta cerradura.");
      }
    })
    .catch(error => {
        alert("Error obteniendo llave del dueño de la cerradura:"+ JSON.stringify(error));
        console.log("Error obteniendo llave del dueño de la cerradura:", error)
    })
    
  }
  confirmarIrAVincularBT(llave: Llave){
    let alert = this.alertCtrl.create({
      title: 'Apertura bluetooth',
      message: 'Debe vincular su teléfono a traves de bluetooth primero.',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Vincular',
        handler: () => {
          console.log('Intentando ir a Vincular Bluetooth');
          this.navCtrl.push(VincularBluetoothPage, {info:llave});
        }
      }]
    });
    alert.present();
  }

}
