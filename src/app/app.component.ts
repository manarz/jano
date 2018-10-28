import { Component, ViewChild } from '@angular/core';
import { Platform, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { LlaveListadoPage } from '../pages/llave-listado/llave-listado';
import { CerraduraListadoPage } from '../pages/cerradura-listado/cerradura-listado';
import { MiPerfilPage } from '../pages/mi-perfil/mi-perfil';
import { LogoutPage } from '../pages/logout/logout';


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
                {titulo: "Mi perfil",            component: MiPerfilPage,          icon:"person"},
                {titulo: "Salir",                component: LogoutPage,            icon:"exit"},
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

