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
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth'; 
import { FIREBASE_CONFIG } from './app.firebase.config';

import { PruebaBleListarDispositivosPage } from '../pages/prueba-ble-listar-dispositivos/prueba-ble-listar-dispositivos';
import { PruebaBleDetalleConexionPage } from '../pages/prueba-ble-detalle-conexion/prueba-ble-detalle-conexion';
import { PruebaEnvioSmsPage } from '../pages/prueba-envio-sms/prueba-envio-sms';
import { CerraduraListadoPage } from '../pages/cerradura-listado/cerradura-listado';
import { LlaveListadoPage } from '../pages/llave-listado/llave-listado';
import { LlaveCompartidaListadoPage } from '../pages/llave-compartida-listado/llave-compartida-listado';
import { LlaveConfiguracionPage } from '../pages/llave-configuracion/llave-configuracion';
import { CerraduraConfiguracionPage } from '../pages/cerradura-configuracion/cerradura-configuracion';

import { RedListadoPage } from '../pages/red-listado/red-listado';
import { VincularBluetoothPage } from '../pages/vincular-bluetooth/vincular-bluetooth';
import { RedAltaPage } from '../pages/red-alta/red-alta';
import { CerraduraAltaPage } from '../pages/cerradura-alta/cerradura-alta';
import { GralConfiguracionPage } from '../pages/gral-configuracion/gral-configuracion';

import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { RegistrarsePage } from '../pages/registrarse/registrarse';

import { RedesProvider } from '../providers/redes/redes';
import { CerradurasProvider } from '../providers/cerraduras/cerraduras';
import { HttpCommandsProvider } from '../providers/http-commands/http-commands';
import { SmsProvider } from '../providers/sms/sms';
import { UsuariosProvider } from '../providers/usuarios/usuarios';
import { PruebaHomePage } from '../pages/prueba-home/prueba-home';
import { JanoProvider } from '../providers/jano/jano';



@NgModule({
  declarations: [
    MyApp,

    LoginPage,
    RegistrarsePage,
    LogoutPage,

    PruebaBleListarDispositivosPage,
    PruebaBleDetalleConexionPage,
    PruebaEnvioSmsPage,
    PruebaHomePage,
    CerraduraListadoPage,
    LlaveListadoPage,
    LlaveCompartidaListadoPage,
    LlaveConfiguracionPage,
    RedListadoPage,
    VincularBluetoothPage,
    RedAltaPage,
    CerraduraAltaPage,
    CerraduraConfiguracionPage,
    GralConfiguracionPage
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule.enablePersistence(),    
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp)
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    LoginPage,
    RegistrarsePage,
    LogoutPage,

    PruebaBleListarDispositivosPage,
    PruebaBleDetalleConexionPage,
    PruebaEnvioSmsPage,
    PruebaHomePage,
    CerraduraListadoPage,
    LlaveListadoPage,
    LlaveCompartidaListadoPage,
    LlaveConfiguracionPage,
    RedListadoPage,
    VincularBluetoothPage,
    RedAltaPage,
    CerraduraAltaPage,
    CerraduraConfiguracionPage,
    GralConfiguracionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BLE,
    BluetoothSerial,
    SMS,
    HTTP,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RedesProvider,
    CerradurasProvider,
    HttpCommandsProvider,
    SmsProvider,
    UsuariosProvider,
    JanoProvider
  ]
})
export class AppModule {}
