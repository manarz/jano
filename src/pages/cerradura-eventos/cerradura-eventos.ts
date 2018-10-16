import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { EventosProvider } from '../../providers/eventos/eventos';
import { Cerradura } from '../../models/cerradura';

@Component({
  selector: 'page-cerradura-eventos',
  templateUrl: 'cerradura-eventos.html',
})
export class CerraduraEventosPage implements OnInit, OnDestroy {
  public listadoEventos: any[];
  subscriptions: Subscription[];
  cerradura: Cerradura;

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventosProv: EventosProvider) {
    this.cerradura = navParams.get('info');
  }
  ngOnInit(): void {
    this.subscriptions=[];
    this.eventosProv.obtenerEventos(this.cerradura);
    this.subscriptions.push(
      this.eventosProv.listadoEventos$.subscribe(listado => this.listadoEventos = listado)
    );
  }
  ngOnDestroy(): void {
    for(let subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }

}
