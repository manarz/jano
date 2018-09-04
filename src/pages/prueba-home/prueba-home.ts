import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase/app';
import { FIREBASE_CONFIG } from '../../app/app.firebase.config';

@Component({
  selector: 'page-prueba-home',
  templateUrl: 'prueba-home.html',
})
export class PruebaHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
}
