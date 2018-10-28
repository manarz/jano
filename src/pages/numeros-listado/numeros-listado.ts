import { Component, OnInit, OnDestroy } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { Cerradura } from '../../models/cerradura';
import { Subscription } from 'rxjs';
import { NumerosNotificacion } from '../../models/numerosNotificacion';
import { NumerosNotificacionProvider } from '../../providers/numeros-notificacion/numeros-notificacion';
import { NumeroAltaPage } from '../numero-alta/numero-alta';
import { CerradurasProvider } from '../../providers/cerraduras/cerraduras';

@Component({
  selector: 'page-numeros-listado',
  templateUrl: 'numeros-listado.html',
})
export class NumerosListadoPage implements OnInit, OnDestroy{
  public cerradura:Cerradura;
  public listadoNumeros: any[];
  subscriptions: Subscription[];
  
  constructor(
    public numerosProv:NumerosNotificacionProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public cerradurasProv: CerradurasProvider
  ) {
    this.listadoNumeros = [];
    console.log("Numeros de confianza, data recibida:",navParams.get('info'));
    this.cerradura=navParams.get('info');
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
    console.log('Intentando eliminar numero',numero);
    this.numerosProv.eliminarNumero(numero, this.cerradura);
  }
  guardarCambiosCerradura(){
    console.log('Intentando modificar cerradura:',this.cerradura.id);
    this.cerradurasProv.modificarCerradura(this.cerradura);
    this.navCtrl.pop();
  }
  puedeAgregarNumeros(){
    return this.cerradura.notificaPuertaForzada && this.listadoNumeros.length<2
  }
}
