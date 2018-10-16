import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Llave } from '../../models/llave';
import { LlavesProvider } from '../../providers/llaves/llaves';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-llave-a-compartir-configuracion',
  templateUrl: 'llave-a-compartir-configuracion.html',
})
export class LlaveACompartirConfiguracionPage {
  public llave: Llave;
  public tiempoLimitado: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public llavesProv: LlavesProvider, public alertCtrl: AlertController, public socialSharing: SocialSharing, public plt:Platform) {
    console.log("Llave configuracion, data recibida:", navParams.get('info'));
    this.llave=navParams.get('info');
    this.tiempoLimitado = false
    this.tiempoLimitado = this.tiempoLimitado || Boolean(this.llave.vigenciaDesde)
    this.tiempoLimitado = this.tiempoLimitado || Boolean(this.llave.vigenciaHasta)
    this.tiempoLimitado = this.tiempoLimitado || Boolean(this.llave.franjaHorariaDesde) 
    this.tiempoLimitado = this.tiempoLimitado || Boolean(this.llave.franjaHorariaHasta)
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.domingo
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.lunes
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.martes
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.miercoles
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.jueves
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.viernes
    this.tiempoLimitado = this.tiempoLimitado || !this.llave.vigenciaDias.sabado

  }
  public crearModificarLlave(){
    if(this.llave.id==''){
      console.log("Intentando crear llave para compartir", this.llave);
      this.llavesProv.crearLlave(this.llave).then(
        llaveAlta => {
          console.log("Alta de llave exitosa con ID: ", llaveAlta.id);
          this.llave.id = llaveAlta.id;
        }).catch(error => console.error("Error agregando llave: ", error));
    } else {
      console.log("Intentando modificar llave compartida.", this.llave);
      this.llavesProv.modificarLlave(this.llave)
    }
  }
  public resetTiempoLimitado() {
    if(!this.tiempoLimitado){
      this.llave.vigenciaDesde = null
      this.llave.vigenciaHasta = null
      this.llave.franjaHorariaDesde = null
      this.llave.franjaHorariaHasta = null
      this.llave.vigenciaDias.domingo = true;
      this.llave.vigenciaDias.lunes = true;
      this.llave.vigenciaDias.martes = true;
      this.llave.vigenciaDias.miercoles = true;
      this.llave.vigenciaDias.jueves = true;
      this.llave.vigenciaDias.viernes = true;
      this.llave.vigenciaDias.sabado = true;
    }
  }
  public compartirLlave() {
    let shareLink = 'https://jano.page.link/?link=' + encodeURIComponent('https://jano-2332.firebaseapp.com/#/login/' + this.llave.id) + '&apn=ar.com.jano';
    console.log('Compartiendo llave:' + shareLink);
    if(this.plt.is('android')){
      const confirm = this.alertCtrl.create({
        title: 'Compartir llave',
        message: '¿Cómo deseas compartir esta llave?',
        buttons: [
          {
            text: 'Whatsapp',
            handler: () => {
              console.log('Compartiendo por whatsapp');
              this.socialSharing.shareViaWhatsApp('Te compartieron una llave Jano! '+shareLink)
              .then(() => {
                console.log('Llave compartida por whatsapp con exito');
              }).catch((err) => {
                console.log('Error al compartir llave por whatsapp con exito', err);
              });
            }
          },
          {
            text: 'email',
            handler: () => {
              this.socialSharing.canShareViaEmail().then(() => {
                console.log('Compartiendo por email');
                // Share via email
                this.socialSharing.shareViaEmail('Te compartieron una llave Jano!','Accede a este link para registrarla: '+ shareLink, ['algunemail@algunemail.com'])
                .then(() => {
                  console.log('Llave compartida por email con exito');
                }).catch((err) => {
                  console.log('Error al compartir llave por email ', err);
                });
  
              }).catch(() => {
                console.log('No esta permitido compartir via email');
              });
            }
          },
          {
            text: 'SMS',
            handler: () => {
              console.log('Compartiendo por SMS');
              this.socialSharing.shareViaSMS('Te compartieron una llave Jano! '+shareLink, '11111')
              .then(() => {
                console.log('Llave compartida por SMS con exito');
              }).catch((err) => {
                console.log('Error al compartir llave por SMS', err);
              });
            }
          }
        ]
      });
      confirm.present();
    }else{
      window.location.href = 'mailto:?subject=Te compartieron una llave Jano!&body=Accede a este link para registrarla: '+ shareLink;
    }
  }
  public sePuedeCompartir(llave: Llave) {
    return llave.id != '' && !llave.dueño;
  }

}
