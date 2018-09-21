import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { CerradurasProvider } from '../../providers/cerraduras/cerraduras';
import { Cerradura } from '../../models/cerradura';

@Component({
  selector: 'page-red-alta',
  templateUrl: 'red-alta.html',
})
export class RedAltaPage {
  myForm: FormGroup;
  private cerradura:Cerradura;

  constructor (
    public cerradurasProv: CerradurasProvider,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public navParams: NavParams) {
      this.myForm = this.createMyForm();
      console.log("Alta de red, data recibida:", this.navParams.get('info'));
      this.cerradura=this.navParams.get('info');

  }

  private createMyForm(){
    return this.formBuilder.group({
      ssid: ['', Validators.required],
      pass: ['', Validators.required]
    });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RedDetallePage');
  }

  public guardarRed(){
    this.cerradurasProv.agregarRed(this.cerradura, this.myForm.value);
    this.navCtrl.pop();
  }
}
