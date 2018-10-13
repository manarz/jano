import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

//import firebase from 'firebase/app';


@Injectable()
export class JanoProvider {
  private janoApp;
  private janoFirestoreDb;
  private janoRealtimeDb;
  constructor() {
  }
  public getJanoFirestoreDb(){
    return firebase.firestore();
  }
  public getJanoDelete(){
    return firebase.firestore.FieldValue.delete();
  }
  public getJanoRealtime(){
    return firebase.database();
  }
}
