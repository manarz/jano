export interface Cerradura {
    id : string,
    descripcion : string,
    dueño : string,
    estado : string,
    codigoActivacion : string,
    telefonoPropio : string,
    
    destinatariosNotificacionSms : { [index: string]: boolean },
    redes : { [index: string]: { pass: string} }
}