import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Llave } from '../../models/llave';
import { LlavesProvider } from '../llaves/llaves';
import { EventosCerradura } from '../../models/eventosCerradura';
import { UsuariosProvider } from '../usuarios/usuarios';
import { EventosProvider } from '../eventos/eventos';
import { Cerradura } from '../../models/cerradura';
import { Red } from '../../models/red';
import { CerradurasProvider } from '../cerraduras/cerraduras';

@Injectable()
export class BluetoothProvider {

  constructor(
    public bluetoothSerial: BluetoothSerial, 
    public llavesProv: LlavesProvider, 
    public usuariosProv: UsuariosProvider, 
    public eventosProv: EventosProvider,
    public cerradurasProv: CerradurasProvider
  ) {
    console.log('BluetoothProvider inicializado');
  }
  public enviarComandoApertura(llave: Llave) {
    console.log("Intentando conexión a " + llave.bluetoothDevice.name + "...");
    this.bluetoothSerial.enable().then(() => {
      this.bluetoothSerial.connect(llave.bluetoothDevice.address)
        .subscribe(
          //conexion exitosa
          (data) => {
            console.log("Conectado.");
            let comando = this.llavesProv.obtenerComandoAperturaCierre(llave);
            this.bluetoothSerial.write(comando)
              .then(data => {
                alert('Comando enviado con exito.');
                //Registro de evento
                let evento = <EventosCerradura>{}
                evento.cerraduraId = llave.idCerradura
                evento.fechaHora = new Date();
                evento.queHizo = (llave.estado == 'ABR') ? 'Cierre ' : 'Apertura ';
                evento.queHizo += "por bluetooth";
                evento.quienFue = this.usuariosProv.nombreDeUsuario();
                this.eventosProv.agregarEvento(evento);
                // Cambio de estado en firebase
                llave.estado = (llave.estado == 'ABR') ? 'CER' : 'ABR';
                llave.nroSecuencia++
                this.llavesProv.modificarLlave(llave);
                this.bluetoothSerial.disconnect();
              })
              .catch(err => alert('Error enviando comando: ' + comando + JSON.stringify(err)));
          },
          //conexion fallida
          (error) => alert("Error de conexion:"+JSON.stringify(error))
        );
    })
  }
  public sincronizarRed(cerradura: Cerradura, red: Red, llave: Llave) {
    console.log("Intentando conexión a " + llave.bluetoothDevice.name + "...");
    this.bluetoothSerial.enable().then(() => {
      this.bluetoothSerial.connect(llave.bluetoothDevice.address)
        .subscribe(
          //conexion exitosa
          (data) => {
            console.log("Conectado.");
            let comando = 'RED;'+red.ssid+';'+red.pass
            this.bluetoothSerial.write(comando)
              .then(data => {
                alert('Comando enviado con exito.');
                //Registro de evento
                let evento = <EventosCerradura>{}
                evento.cerraduraId = llave.idCerradura
                evento.fechaHora = new Date();
                evento.queHizo = 'Nueva red sincronizada: '+ red.ssid;
                evento.queHizo += "por bluetooth";
                evento.quienFue = this.usuariosProv.nombreDeUsuario();
                this.eventosProv.agregarEvento(evento);
                //guardar red sincronizada
                cerradura.redId=red.id;
                this.cerradurasProv.modificarCerradura(cerradura);
                this.bluetoothSerial.disconnect();
              })
              .catch(err => alert('Error enviando comando: ' + comando + JSON.stringify(err)));
          },
          //conexion fallida
          (error) => alert("Error de conexion:"+JSON.stringify(error))
        );
    })
  }

}
