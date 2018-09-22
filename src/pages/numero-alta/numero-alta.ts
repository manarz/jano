import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cerradura } from '../../models/cerradura';
import { NumerosNotificacionProvider } from '../../providers/numeros-notificacion/numeros-notificacion';


@Component({
  selector: 'page-numero-alta',
  templateUrl: 'numero-alta.html',
})
export class NumeroAltaPage {

  myForm: FormGroup;
  private cerradura:Cerradura;

  constructor (
    public numerosProv: NumerosNotificacionProvider,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public navParams: NavParams) {
      this.myForm = this.createMyForm();
      console.log("Alta de numero de notificacion, data recibida:", this.navParams.get('info'));
      this.cerradura=this.navParams.get('info');

  }

  private createMyForm(){
    return this.formBuilder.group({
      descripcion: ['', Validators.required],
      numero:      ['', Validators.required]
    });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RedDetallePage');
  }

  public guardarNumero(){
    this.numerosProv.agregarNumero(this.cerradura, this.myForm.value);
    this.navCtrl.pop();
  }
}
