import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { ContadorDTO } from '../models/contadorDTO';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  private path = this.sharedService.urlApiBanco+'/Consultas';

  constructor(
    private http:HttpClient,
    private sharedService:SharedService
  ){ }

  public relacionCuenta(idCliente: number){
    return this.http.get<ContadorDTO[]>(this.path+"/ObtenerRelacionCuenta?idCliente="+idCliente);
  }
  
  public relacionCuentaId(idCliente: number){
    return this.http.get<ContadorDTO[]>(this.path+"/ObtenerRelacionCuentaId?idCliente="+idCliente);
  }

  public existenciaCuenta(numeroCuenta: number){
    return this.http.get<ContadorDTO[]>(this.path+"/ObtenerExistenciaCuenta?numeroCuenta="+numeroCuenta);
  }
}
