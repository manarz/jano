import { Injectable } from '@angular/core';
import { JanoProvider } from '../jano/jano';

@Injectable()
export class CerraduraRealtimeProvider {
  private bd;
  constructor(public janoProv: JanoProvider) {
    this.bd=this.janoProv.getJanoRealtime();
  }

}
