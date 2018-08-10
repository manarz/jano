export interface Cerradura {
    id : string,
    estado : string,
    codigoActivacion : string,
    telefonoPropio : string,
    
    destinatariosNotificacionSms : { [index: string]: boolean },
    dueños : { [index: string]: boolean },
    redes : { [index: string]: { pass: string} }
}