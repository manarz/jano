import { Component, ViewChild } from '@angular/core';
import { Platform, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PruebaBleListarDispositivosPage } from '../pages/prueba-ble-listar-dispositivos/prueba-ble-listar-dispositivos';
import { PruebaBleDetalleConexionPage } from '../pages/prueba-ble-detalle-conexion/prueba-ble-detalle-conexion';
import { PruebaEnvioSmsPage } from '../pages/prueba-envio-sms/prueba-envio-sms';
import { CerraduraListadoPage } from '../pages/cerradura-listado/cerradura-listado';
import { LlaveListadoPage } from '../pages/llave-listado/llave-listado';
import { RedListadoPage } from '../pages/red-listado/red-listado';
import { VincularBluetoothPage } from '../pages/vincular-bluetooth/vincular-bluetooth';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { PruebaHomePage } from '../pages/prueba-home/prueba-home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild("NAV") nav:Nav;
  public rootPage:any;
  public pages:Array<{titulo:string,component:any,icon:string}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    this.rootPage = LoginPage;
    this.pages=[{titulo: "Mi llavero",           component: LlaveListadoPage,      icon:"key" },
                {titulo: "Mis cerraduras",       component: CerraduraListadoPage,  icon:"lock"},
                {titulo: "Salir",                component: LogoutPage,            icon:"exit"},
/*
                {titulo: "Vincular Bluetooth",   component: VincularBluetoothPage, icon:"bluetooth"},
                {titulo: "Test sms",   component: PruebaEnvioSmsPage,    icon:"mail"},
                {titulo: "Bluetooth BLE",        component: PruebaBleListarDispositivosPage, icon:"information-circle"},
                {titulo: "Mis Redes",            component: RedListadoPage,        icon:"wifi"},
                {titulo: "Detalle BLE",          component: PruebaBleDetalleConexionPage,    icon:"code-working"},
                {titulo: "Configuracion",        component: GralConfiguracionPage, icon:"construct"}
*/ 
    ];
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  goToPage(page){
    this.nav.setRoot(page);
  }
}

