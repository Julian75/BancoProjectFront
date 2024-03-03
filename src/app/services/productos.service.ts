import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { Productos } from '../models/productos';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private path = this.sharedService.urlApiBanco+'/Productos';

  constructor(
    private http:HttpClient,
    private sharedService:SharedService
  ){ }

  public listarTodos(){
    return this.http.get<Productos[]>(this.path+'/Obtener');
  }

  public listarPorId(id: number){
    return this.http.get<Productos>(this.path+'/ObtenerId/'+id);
  }

  public registrar(productos: Productos){
    return this.http.post<void>(this.path+'/Guardar',productos);
  }

  public actualizar(productos: Productos){
    return this.http.put<void>(this.path+'/Modificar/'+ productos.id,productos);
  }

  public eliminar(id: number){
    return this.http.delete<void>(this.path+'/Eliminar/'+id);
  }
}
