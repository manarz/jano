import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { CerradurasProvider } from '../../providers/cerraduras/cerraduras';
import { Cerradura } from '../../models/cerradura';

@Component({
  selector: 'page-cerradura-alta',
  templateUrl: 'cerradura-alta.html',
})
export class CerraduraAltaPage {
  myForm: FormGroup;
  constructor (
    public cerradurasProv: CerradurasProvider,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public navParams: NavParams) {
      this.myForm = this.createMyForm();
  }

  private createMyForm(){
    return this.formBuilder.group({
      descripcion:      ['', Validators.required],
      telefonoPropio:   ['', Validators.required],
      codigoActivacion: ['', Validators.required],
    });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RedDetallePage');
  }

  public guardarCerradura(){
    this.cerradurasProv.agregarCerradura(<Cerradura>this.myForm.value);
    this.navCtrl.pop();
  }
}
