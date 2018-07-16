import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpCommandsProvider {
  private urlData: any;
  constructor(public http: HTTP) {
    this.urlData = { url:'www.google.com.ar' };
  }

  public setearHost(data){
    this.urlData=data;
  }
  public getHost(){
    return this.urlData.url;
  }



  public toogleStatusCerradura(cerradura:any){
    this.http.get('http://' + this.urlData.url, { COMMAND:(cerradura.estaAbierta) ? 'CERRAR' : 'ABRIR' }, {})
    .then(data => {
      cerradura.estaAbierta=!cerradura.estaAbierta;
      alert(JSON.stringify(data));
    })
    .catch(error => {
      alert(JSON.stringify(error));
    });
  }
}
