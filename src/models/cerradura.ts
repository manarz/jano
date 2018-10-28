export interface Cerradura {
    id : string,
    descripcion : string,
    dueño : string,
    estado : string,
    codigoActivacion : string,
    telefonoPropio : string,
    redId: string, 
    telefonoDuenio: string,
    notificaAperturaManual: boolean,
    notificaBateriaBaja: boolean,
    notificaSaldoMinimo: number,
    notificaSaldoXPeriodo: number,
    notificaPuertaForzada: boolean,
    cierreAutomatico: boolean
}