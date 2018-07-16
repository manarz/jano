import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { RedesProvider } from '../../providers/redes/redes';

@Component({
  selector: 'page-red-alta',
  templateUrl: 'red-alta.html',
})
export class RedAltaPage {
  myForm: FormGroup;
  constructor (
    public redesProv: RedesProvider,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public navParams: NavParams) {
      this.myForm = this.createMyForm();
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
    //console.log(this.myForm.value);
    this.redesProv.addRed(this.myForm.value);
    this.navCtrl.pop();
  }
}
