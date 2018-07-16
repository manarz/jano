import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { CerradurasProvider } from '../../providers/cerraduras/cerraduras';

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
      esPropia:    [true],
      descripcion: ['', Validators.required],
      celular:     ['', Validators.required],
      estaAbierta: [true]
    });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RedDetallePage');
  }

  public guardarCerradura(){
    //console.log(this.myForm.value);
    this.cerradurasProv.addCerradura(this.myForm.value);
    this.navCtrl.pop();
  }
}
