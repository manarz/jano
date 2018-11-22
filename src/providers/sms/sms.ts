import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import { Cerradura } from '../../models/cerradura';
import { Llave } from '../../models/llave';
import { LlavesProvider } from '../llaves/llaves';
import { UsuariosProvider } from '../usuarios/usuarios';
import { EventosProvider } from '../eventos/eventos';
import { EventosCerradura } from '../../models/eventosCerradura';

@Injectable()
export class SmsProvider {

  constructor(public smsProv: SMS, public alertCtrl: AlertController, public llavesProv: LlavesProvider, public usuariosProv: UsuariosProvider, public eventosProv: EventosProvider) {
  }

  public toogleStatusCerradura(llave: Llave){
    let comando=this.llavesProv.obtenerComandoAperturaCierre(llave);
    let com1=comando.substr(0,4)
    let com2=btoa(comando.substr(4)).substr(0,3);
    let com3=btoa(comando.substr(4)).substr(3);
    this.smsProv.send(llave.telefonoCerradura, com1+com2+'J'+com3
    )
    .then(()=>{
      //Registro de evento
      let evento=<EventosCerradura>{}
      evento.cerraduraId=llave.idCerradura
      evento.fechaHora= new Date();
      evento.queHizo  = (llave.estado=='ABR')?'Cierre ':'Apertura ';
      evento.queHizo += "por SMS";
      evento.quienFue = this.usuariosProv.nombreDeUsuario();
      this.eventosProv.agregarEvento(evento);

      let alert = this.alertCtrl.create({
        title: 'Mensaje enviado',
        message: 'Mensaje enviado con exito',
        buttons: ['Ok']
      });
      alert.present();
      llave.estado=(llave.estado=='ABR')?'CER':'ABR';
      llave.nroSecuencia++
      this.llavesProv.modificarLlave(llave);
    })
    .catch(()=>{
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'No se ha podido enviar el mensaje!',
        buttons: ['Ok']
      });
      alert.present();
    });
 
  }
}
