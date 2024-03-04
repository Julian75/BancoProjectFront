import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductosService } from '../../services/productos.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AgregarProductoComponent } from './agregar-producto/agregar-producto.component';
import { CurrencyPipe } from '@angular/common';
import { Productos } from '../../models/productos';

@Component({
  selector: 'app-productos',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatIconModule, MatTableModule, MatPaginatorModule, MatButtonModule, RouterLink, MatTooltipModule, MatDialogModule, CurrencyPipe],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

  displayedColumns: string[] = ['id', 'tipoCuenta', 'cliente', 'saldo', 'estado', 'opciones'];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioProductos: ProductosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(){
    this.listarProductos()
  }

  public listarProductos(){
    this.servicioProductos.listarTodos().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  public abrirModalAgregar() {
    this.dialog.open(AgregarProductoComponent, {
      width: '450px',
      height: '450px'
    }).afterClosed().subscribe(res=>{
      this.listarProductos()
    });
  }

  public cambiarEstado(idProducto: number) {
    this.servicioProductos.listarPorId(idProducto).subscribe(res=>{
      let producto: Productos = new Productos();
      producto.id = res.id
      if(res.estado == "Activa"){
        producto.estado = "Inactiva"
      }else{
        producto.estado = "Activa"
      }
      producto.fechaCreacion = res.fechaCreacion
      producto.idCliente = res.idCliente
      producto.numeroCuenta = res.numeroCuenta
      producto.saldo = res.saldo
      producto.tipoCuenta = res.tipoCuenta
      this.servicioProductos.actualizar(producto).subscribe(res=>{
        Swal.fire({
          title: "Cuenta cambiada de estado!",
          icon: "success"
        });
        this.listarProductos()
      })
    })
  }

  public cancelarCuenta(idProducto: number) {
    Swal.fire({
      title: "Esta seguro de cancelar la cuenta?",
      text: "Este procedimiento no podra ser revertido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cancelar Cuenta!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioProductos.listarPorId(idProducto).subscribe(res=>{
          if (res.saldo == 0) {
            let producto: Productos = new Productos();
            producto.id = res.id
            producto.estado = "Cancelada"
            producto.fechaCreacion = res.fechaCreacion
            producto.idCliente = res.idCliente
            producto.numeroCuenta = res.numeroCuenta
            producto.saldo = res.saldo
            producto.tipoCuenta = res.tipoCuenta
            this.servicioProductos.actualizar(producto).subscribe(res=>{
              Swal.fire({
                title: "Cuenta Cancelada!",
                icon: "success"
              });
              this.listarProductos()
            })
          }else{
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Para cancelar la cuenta el saldo debe ser de 0!',
              showConfirmButton: false,
              timer: 2500
            })
          }
        })
      }
    });
  }
}
