import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RedAltaPage } from '../red-alta/red-alta';
import { Red } from '../../models/red';
import { RedesProvider } from '../../providers/redes/redes';
import { Subscription } from 'rxjs';



@Component({
  selector: 'page-red-listado',
  templateUrl: 'red-listado.html',
})
export class RedListadoPage {
  public listadoRedes: any[];
  private cerradura:any;
  subscriptions: Subscription[]
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public redesProv: RedesProvider) {
  
      //this.listadoRedes = this.redesProv.getRedes();
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad MisRedesPage');
  }
  irANuevaRed(){
    this.navCtrl.push(RedAltaPage, { info: this.cerradura });
  }
  eliminarRed(red: Red){
    console.log('Intentando eliminar red',red);
    this.redesProv.eliminarRed(red);
  }
}
