import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Llave } from '../../models/llave';
import { LlavesProvider } from '../../providers/llaves/llaves';

@Component({
  selector: 'page-llave-compartida-recepcion',
  templateUrl: 'llave-compartida-recepcion.html',
})
export class LlaveCompartidaRecepcionPage {
  public idLlave: string;
  public llave: Llave;
  constructor(public navCtrl: NavController, public navParams: NavParams, public llaveProv: LlavesProvider) {
    console.log("Recepcion de llave compartida, data recibida:",navParams.get('info'));
    this.idLlave=navParams.get('info');
    this.llave=<Llave>{};
    this.llaveProv.obtenerLlavePuntual(this.idLlave)
    .then(llavePedida=>{
      if (llavePedida.exists) {
        this.llave = { id: this.idLlave,...llavePedida.data()};
        console.log('Llave obtenida:', this.llave);
      }else{
        console.log('No se encontro la llave buscada.');
      }
    })
    .catch(e=>console.log('Error obteniendo llave id:'+ this.idLlave))
  }



}
