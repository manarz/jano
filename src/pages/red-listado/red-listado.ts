import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RedAltaPage } from '../red-alta/red-alta';
import { RedesProvider } from '../../providers/redes/redes';



@Component({
  selector: 'page-red-listado',
  templateUrl: 'red-listado.html',
})
export class RedListadoPage {
  public listadoRedes: any[];
  private cerradura:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public redesProv: RedesProvider) {
  
      //this.listadoRedes = this.redesProv.getRedes();
      console.log("Listado de redes, data recibida:", this.navParams.get('info'));
      this.cerradura=this.navParams.get('info');
      this.listadoRedes=this.cerradura.data.redes;
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MisRedesPage');
  }
  nuevaRed(){
    this.navCtrl.push(RedAltaPage);
  }
  eliminarRed(){
    console.log('Eliminar red');
  }
}
