import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClientesService } from '../../services/clientes.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ConsultasService } from '../../services/consultas.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatIconModule, MatTableModule, MatPaginatorModule, MatButtonModule, RouterLink, DatePipe, MatTooltipModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {

  displayedColumns: string[] = ['id', 'nombres', 'identificacion', 'correo', 'fechaNacimiento', 'opciones'];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioClientes: ClientesService,
    private servicioConsulta: ConsultasService
  ) {}

  ngOnInit(){
    this.listarClientes()
  }

  public listarClientes(){
    this.servicioClientes.listarTodos().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  public eliminarCliente(idCliente: number) {
    Swal.fire({
      title: "Esta seguro de eliminar este cliente?",
      text: "Este procedimiento no podra ser revertido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioConsulta.relacionCuenta(idCliente).subscribe(resCliente=>{
          if(resCliente[0].contadorCliente == 0){
            this.servicioClientes.eliminar(idCliente).subscribe(res=>{
              Swal.fire({
                title: "Cliente Eliminado!",
                icon: "success"
              });
              this.listarClientes()
            })
          }else{
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'El cliente no puede ser eliminado ya que tiene una cuenta vinculada!',
              showConfirmButton: false,
              timer: 2500
            })
          }
        })
      }
    });
  }
}
