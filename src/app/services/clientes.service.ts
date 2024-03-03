import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { Clientes } from '../models/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private path = this.sharedService.urlApiBanco+'/Clientes';

  constructor(
    private http:HttpClient,
    private sharedService:SharedService
  ){ }

  public listarTodos(){
    return this.http.get<Clientes[]>(this.path+'/Obtener');
  }

  public listarPorId(id: number){
    return this.http.get<Clientes>(this.path+'/ObtenerId/'+id);
  }

  public registrar(clientes: Clientes){
    return this.http.post<void>(this.path+'/Guardar',clientes);
  }

  public actualizar(clientes: Clientes){
    return this.http.put<void>(this.path+'/Modificar/'+ clientes.id,clientes);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}
