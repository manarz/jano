export interface Llave {
    id: string;
    idCerradura : string,
    codigoActivacion: string,
    nombreFamiliar : string,
    estado : string,
    dueño : string,
    email: string,
    esAdministrador : boolean,
    aperturaAutomatica : boolean, 
    cierreAutomatico : boolean,
    telefonoCerradura : string,
    bluetoothDevice: {
        name: string,
        address: string
    },

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