export interface Llave {
    id: string;
    idCerradura : string,
    nombreFamiliar : string,
    estado : string,
    dueño : string,
    esPropia : boolean,
    telefonoCerradura : string,

    aperturaOffline : boolean,
    aperturaRemota : boolean,

    vigenciaDesde : string,
    vigenciaHasta : string,

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