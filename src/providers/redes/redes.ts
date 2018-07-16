import { Injectable } from '@angular/core';

@Injectable()
export class RedesProvider {
  private listadoRedes: any[];
  constructor() {
    this.listadoRedes = [ 
    { ssid:"fiber1",      pass:"password123" },
    { ssid:"speedy",      pass:"aefqw5e68e"  },
    { ssid:"telecentro1", pass:"12df3ef32"   },
    { ssid:"telecentro2", pass:"51634f516"   },
    { ssid:"telecentro3", pass:"afpowejjf"   }
  ]; 
 }
  public getRedes(){
    return this.listadoRedes;
  }
  public addRed(red:any){
    this.listadoRedes.push(red);
  }

}
