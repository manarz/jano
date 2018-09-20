export interface Llave {
    idCerradura : string,
    nombreFamiliar : string,
    estado : string,
    dueño : string,
    esPropia : boolean,

    aperturaOffline : boolean,
    aperturaRemota : boolean,

    vigenciaDesde : number,
    vigenciaHasta : number,

    franjaHorariaDesde : string,
    franjaHorariaHasta : string,

    vigenciaDias : {
        domingo : boolean,
        lunes : boolean,
        martes : boolean,
        miercoles : boolean,
        jueves : boolean,
        viernes : boolean,
        sabado : boolean
    },
    nroSecuencia: number

}