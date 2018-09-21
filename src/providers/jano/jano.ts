import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

@Injectable()
export class JanoProvider {
  private janoApp;
  private janoFirestoreDb;
  constructor(public http: HTTP) {
    this.janoApp = firebase.app;
  }
  public getJanoApp(){
    return this.janoApp;
  }
  public getJanoFirestoreDb(){
    this.janoFirestoreDb = firebase.firestore();
    return this.janoFirestoreDb;
  }
  public getJanoDelete(){
    return firebase.firestore.FieldValue.delete();
  }
}
