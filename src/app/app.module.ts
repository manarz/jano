import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BLE } from '@ionic-native/ble';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { SMS } from '@ionic-native/sms';
import { HTTP } from '@ionic-native/http';

import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth'; 
import { FIREBASE_CONFIG } from './app.firebase.config';

import { PruebaBleListarDispositivosPage } from '../pages/prueba-ble-listar-dispositivos/prueba-ble-listar-dispositivos';
import { PruebaBleDetalleConexionPage } from '../pages/prueba-ble-detalle-conexion/prueba-ble-detalle-conexion';
import { PruebaEnvioSmsPage } from '../pages/prueba-envio-sms/prueba-envio-sms';
import { CerraduraListadoPage } from '../pages/cerradura-listado/cerradura-listado';
import { RedListadoPage } from '../pages/red-listado/red-listado';
import { VincularBluetoothPage } from '../pages/vincular-bluetooth/vincular-bluetooth';
import { RedAltaPage } from '../pages/red-alta/red-alta';
import { CerraduraAltaPage } from '../pages/cerradura-alta/cerradura-alta';
import { GralConfiguracionPage } from '../pages/gral-configuracion/gral-configuracion';


import { RedesProvider } from '../providers/redes/redes';
import { CerradurasProvider } from '../providers/cerraduras/cerraduras';
import { HttpCommandsProvider } from '../providers/http-commands/http-commands';
import { SmsProvider } from '../providers/sms/sms';
import { LoginPage } from '../pages/login/login';
import { RegistrarsePage } from '../pages/registrarse/registrarse';



@NgModule({
  declarations: [
    MyApp,

    LoginPage,
    RegistrarsePage,

    PruebaBleListarDispositivosPage,
    PruebaBleDetalleConexionPage,
    PruebaEnvioSmsPage,
    CerraduraListadoPage,
    RedListadoPage,
    VincularBluetoothPage,
    RedAltaPage,
    CerraduraAltaPage,
    GralConfiguracionPage
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp)
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    LoginPage,
    RegistrarsePage,

    PruebaBleListarDispositivosPage,
    PruebaBleDetalleConexionPage,
    PruebaEnvioSmsPage,
    CerraduraListadoPage,
    RedListadoPage,
    VincularBluetoothPage,
    RedAltaPage,
    CerraduraAltaPage,
    GralConfiguracionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BLE,
    BluetoothSerial,
    SMS,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RedesProvider,
    CerradurasProvider,
    HttpCommandsProvider,
    SmsProvider
  ]
})
export class AppModule {}
