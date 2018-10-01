import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Llave } from '../../models/llave';
import { LlavesProvider } from '../../providers/llaves/llaves';

@Component({
  selector: 'page-llave-a-compartir-configuracion',
  templateUrl: 'llave-a-compartir-configuracion.html',
})
export class LlaveACompartirConfiguracionPage {
  private llave: Llave;

  constructor(public navCtrl: NavController, public navParams: NavParams, public llavesProv: LlavesProvider) {
    console.log("Llave configuracion, data recibida:", navParams.get('info'));
    this.llave=navParams.get('info');
  }
  public crearModificarLlave(){
    if(this.llave.id==''){
      console.log("Intentando crear llave para compartir", this.llave);
      this.llavesProv.crearLlave(this.llave).then(
        llaveAlta => {
          console.log("Alta de llave exitosa con ID: ", llaveAlta.id);
          this.llave.id = llaveAlta.id;
        }).catch(error => console.error("Error agregando llave: ", error));  
      }else{
        console.log("Intentando modificar llave compartida.", this.llave);
        this.llavesProv.modificarLlave(this.llave)
      }
    }
    public compartirLlave(){
      let shareLink='https://jano.page.link/?link='+encodeURIComponent('https://jano-2332.firebaseapp.com/#/login/' + this.llave.id)+'&apn=ar.com.jano';
      console.log('Compartiendo llave:'+ shareLink);
    }
    public sePuedeCompartir(llave: Llave){
      return llave.id != '' && !llave.dueño;
    }

}
