import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { LoginPage } from '../login/login';
import { CerradurasProvider } from '../../providers/cerraduras/cerraduras';
import { LlavesProvider } from '../../providers/llaves/llaves';

@Component({
  selector: 'page-mi-perfil',
  templateUrl: 'mi-perfil.html',
})
export class MiPerfilPage {
  public nombreDeUsuario: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public usuariosProv: UsuariosProvider, 
    public alertCtrl: AlertController,
    public cerradurasProv: CerradurasProvider,
    public llavesProv: LlavesProvider
  ) {
    this.nombreDeUsuario=this.usuariosProv.nombreDeUsuario();
  }
  public verificarPasswordYEliminarCuenta(){
    let alert=this.alertCtrl.create({
    title: 'Eliminar Cuenta',
    message: 'Ingresa los datos de tu cuenta por favor.',
    inputs: [
      {
        name: 'mail',
        placeholder: 'mail'
      },
      {
        name: 'password',
        placeholder: 'Password',
        type: 'password'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Eliminar cuenta',
        handler: data => {
                console.log("Intentando Verificar password");
                this.usuariosProv.validarCuenta(data.mail, data.password)
                .then(data=>
                  this.eliminarCuenta()
                ).catch(e=>{
                  this.mensajeCuentaInvalida();
                })
        }
      }
    ]
    });
    alert.present();
  }
  mensajeCuentaInvalida(){
    let alert=this.alertCtrl.create({
      title: 'Eliminar Cuenta',
      message: 'No se pudieron verificar los datos de su cuenta.',
      buttons:['OK']  
    })
    alert.present();
  }
  public async logout(){
    try{
      this.usuariosProv.logout();
      this.goToLogin();
    } catch(e){
      console.log("Login fallido");
      console.log(e);
    }
  }
  public eliminarCuenta(){
    let alert=this.alertCtrl.create({
      title: 'Eliminar Cuenta',
      message: 'Se procederá a eliminar tu cuenta con todas tus cerraduras y llaves.',
      buttons:[{
        text: 'Cancelar',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Aceptar',
        handler: data => {
                this.cerradurasProv.eliminarCuenta(this.usuariosProv.getUsuario())
                this.llavesProv.eliminarCuenta(this.usuariosProv.getUsuario())
                this.usuariosProv.eliminarCuenta()
                this.goToLogin()                
        }
      }
]  
    })
    alert.present();
  }
  public goToLogin(){
    this.navCtrl.setRoot(LoginPage);
  }

}
