import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { Transacciones } from '../models/transacciones';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  private path = this.sharedService.urlApiBanco+'/Transacciones';

  constructor(
    private http:HttpClient,
    private sharedService:SharedService
  ){ }

  public listarTodos(){
    return this.http.get<Transacciones[]>(this.path+'/Obtener');
  }

  public listarPorId(id: number){
    return this.http.get<Transacciones>(this.path+'/ObtenerId/'+id);
  }

  public registrar(transacciones: Transacciones){
    return this.http.post<void>(this.path+'/Guardar',transacciones);
  }

  public actualizar(transacciones: Transacciones){
    return this.http.put<void>(this.path+'/Modificar/'+ transacciones.id,transacciones);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}
