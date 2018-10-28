import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { RedListadoPage } from '../red-listado/red-listado';
import { Cerradura } from '../../models/cerradura';
import { CerradurasProvider } from '../../providers/cerraduras/cerraduras';
import { NumerosListadoPage } from '../numeros-listado/numeros-listado';



@Component({
  selector: 'page-cerradura-configuracion',
  templateUrl: 'cerradura-configuracion.html',
})

export class CerraduraConfiguracionPage {
  public cerradura: Cerradura;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cerradurasProv: CerradurasProvider,
    public alertCtrl: AlertController
  ) {
    console.log("Configuracion de cerradura, data recibida:", navParams.get('info'));
    this.cerradura = navParams.get('info');
    this.cerradurasProv.vincularSaldo(this.cerradura);
  }
  public consultarSaldo() {
    this.cerradurasProv.pedirSaldo(this.cerradura);
    let alert = this.alertCtrl.create({
      title: 'Consulta de saldo registrada',
      message: 'Se registro correctamente la consulta. El campo saldo se actualizará cuando se obtenga el saldo de su linea',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          console.log('Aceptado');
        }
      }]
    });
    alert.present();
  }
  public irAdministrarWifi() {
    console.log("Redirigiendo al listado de redes.", this.cerradura);
    this.navCtrl.push(RedListadoPage, { info: this.cerradura });
  }
  public irANumerosDeConfianza() {
    console.log("Redirigiendo al listado de numeros de confianza.");
    this.navCtrl.push(NumerosListadoPage, { info: this.cerradura });
  }
  public guardarCambiosCerradura() {
    console.log('Intentando modificar cerradura:', this.cerradura.id);
    this.cerradurasProv.modificarCerradura(this.cerradura);
    this.navCtrl.pop();
  }

  public eliminarCerradura() {
    console.log('Intentando eliminar cerradura:', this.cerradura.id);
    this.cerradurasProv.eliminarCerradura(this.cerradura);
    this.navCtrl.pop();
  }
}
