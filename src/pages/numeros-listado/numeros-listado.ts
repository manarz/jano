import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Cerradura } from '../../models/cerradura';
import { Subscription } from 'rxjs';
import { NumerosNotificacion } from '../../models/numerosNotificacion';
import { NumerosNotificacionProvider } from '../../providers/numeros-notificacion/numeros-notificacion';
import { NumeroAltaPage } from '../numero-alta/numero-alta';

@Component({
  selector: 'page-numeros-listado',
  templateUrl: 'numeros-listado.html',
})
export class NumerosListadoPage {
  private cerradura:Cerradura;
  public listadoNumeros: any[];
  subscriptions: Subscription[];
  
  constructor(public numerosProv:NumerosNotificacionProvider,public navCtrl: NavController, public navParams: NavParams) {
    console.log("Numeros de confianza, data recibida:",navParams.get('info'));
    this.cerradura=navParams.get('info');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NumerosListadoPage');
  }
  ngOnInit(): void {
    this.subscriptions=[];
    this.numerosProv.getNumeros(this.cerradura);
    this.subscriptions.push(
      this.numerosProv.listadoNumeros$.subscribe(listado => this.listadoNumeros = listado)
    );
  }
  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }
  irANuevoNumero(){
    this.navCtrl.push(NumeroAltaPage, { info: this.cerradura });
  }
  eliminarNumero(numero: NumerosNotificacion){
    console.log('Intentando eliminar red',numero);
    this.numerosProv.eliminarNumero(numero);
  }
}
