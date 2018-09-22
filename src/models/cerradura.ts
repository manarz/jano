import { Red } from "./red";

export interface Cerradura {
    id : string,
    descripcion : string,
    dueño : string,
    estado : string,
    codigoActivacion : string,
    telefonoPropio : string,
    
    destinatariosNotificacionSms : Array<number>,
    redes : Array<Red>
}