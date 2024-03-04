import { Clientes } from "./clientes";

export class Transacciones {
    public id: number = 0;
    public tipoTransaccion: string = "";
    public saldo: number = 0;
    idCuentaPrincipal !: Clientes
    idCuentaSecundario !: Clientes
}