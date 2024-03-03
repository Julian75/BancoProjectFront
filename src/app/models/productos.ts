import { Clientes } from "./clientes";

export class Productos {
    public id: number = 0;
    public tipoCuenta: string = "";
    public numeroCuenta: number = 0;
    public estado: string = "";
    public saldo: number = 0;
    public fechaCreacion: Date = new Date();
    public fechaModificacion: Date = new Date();
    idCliente !: Clientes
}