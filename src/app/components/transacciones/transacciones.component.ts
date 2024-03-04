import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { Transacciones } from '../../models/transacciones';
import { TransaccionesService } from '../../services/transacciones.service';
import { ClientesService } from '../../services/clientes.service';
import { ConsultasService } from '../../services/consultas.service';
import { ProductosService } from '../../services/productos.service';
import { Productos } from '../../models/productos';

@Component({
  selector: 'app-transacciones',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.css'
})
export class TransaccionesComponent {

  public formulario!: FormGroup;
  public tipoTransacciones = ["Consignación", "Retiro", "Transferencia"]
  public listaClientes: any = [];
  public listaClientes2: any = [];
  public seleccion = "";

  constructor(
    private fb: FormBuilder,
    private servicioTransaccion: TransaccionesService,
    private servicioClientes: ClientesService,
    private servicioConsulta: ConsultasService,
    private servicioProducto: ProductosService,
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.listarClientes();
  }

  private crearFormulario() {
    this.formulario = this.fb.group({
      id: 0,
      tipoTransaccion: [null, Validators.required],
      cuentaPrincipal: [null, Validators.required],
      saldo: [null, Validators.required],
      cuentaSecundaria: [null],
    });
  }

  public listarClientes() {
    this.servicioClientes.listarTodos().subscribe(res=>{
      this.listaClientes = res
      this.listaClientes2 = res
    })
  }

  public seleccionTransaccion(event: any) {
    this.seleccion = event.value
  }

  public guardarTransaccion() {
    if(this.formulario.valid) {
      this.servicioClientes.listarPorId(this.formulario.controls['cuentaPrincipal'].value).subscribe(res=>{
        let transaccion: Transacciones = new Transacciones();
        transaccion.tipoTransaccion = this.formulario.controls['tipoTransaccion'].value
        transaccion.saldo = this.formulario.controls['saldo'].value
        transaccion.idCuentaPrincipal = res
        transaccion.idCuentaSecundario = res
        if(this.seleccion == "Consignación"){
          this.servicioConsulta.relacionCuentaId(res.id).subscribe(resExisteProducto=>{
            this.servicioProducto.listarPorId(resExisteProducto[0].idProducto).subscribe(resProducto=>{
              let producto: Productos = new Productos();
              producto.estado = resProducto.estado
              producto.fechaCreacion = resProducto.fechaCreacion
              producto.id = resProducto.id
              producto.idCliente = resProducto.idCliente
              producto.numeroCuenta = resProducto.numeroCuenta
              producto.tipoCuenta = resProducto.tipoCuenta
              producto.saldo = resProducto.saldo + this.formulario.controls['saldo'].value
              this.servicioProducto.actualizar(producto).subscribe(resActualizado=>{})
              this.registrar(transaccion)
            })
          })
        }else if(this.seleccion == "Retiro"){
          this.servicioConsulta.relacionCuentaId(res.id).subscribe(resExisteProducto=>{
            console.log(resExisteProducto)
            this.servicioProducto.listarPorId(resExisteProducto[0].idProducto).subscribe(resProducto=>{
              if(resProducto.saldo > this.formulario.controls['saldo'].value){
                let producto: Productos = new Productos();
                producto.estado = resProducto.estado
                producto.fechaCreacion = resProducto.fechaCreacion
                producto.id = resProducto.id
                producto.idCliente = resProducto.idCliente
                producto.numeroCuenta = resProducto.numeroCuenta
                producto.tipoCuenta = resProducto.tipoCuenta
                producto.saldo = resProducto.saldo - this.formulario.controls['saldo'].value
                this.servicioProducto.actualizar(producto).subscribe(resActualizado=>{})
                this.registrar(transaccion)
              }else{
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'El retiro excede la cantidad disponible de saldo!',
                  showConfirmButton: false,
                  timer: 2500
                })
              }
            })
          })
        }else{
          console.log(this.formulario.controls['cuentaSecundaria'].value)
          this.servicioClientes.listarPorId(this.formulario.controls['cuentaSecundaria'].value).subscribe(resCuentaSecundaria=>{
            transaccion.idCuentaSecundario = resCuentaSecundaria
            this.servicioConsulta.relacionCuentaId(res.id).subscribe(resExisteProducto=>{
              this.servicioProducto.listarPorId(resExisteProducto[0].idProducto).subscribe(resProducto=>{
                this.servicioConsulta.relacionCuentaId(resCuentaSecundaria.id).subscribe(resExisteProductoSecundario=>{
                  this.servicioProducto.listarPorId(resExisteProductoSecundario[0].idProducto).subscribe(resProductoSecundario=>{
                    if(resProducto.saldo > this.formulario.controls['saldo'].value){
                      let producto: Productos = new Productos();
                      producto.estado = resProducto.estado
                      producto.fechaCreacion = resProducto.fechaCreacion
                      producto.id = resProducto.id
                      producto.idCliente = resProducto.idCliente
                      producto.numeroCuenta = resProducto.numeroCuenta
                      producto.tipoCuenta = resProducto.tipoCuenta
                      producto.saldo = resProducto.saldo - this.formulario.controls['saldo'].value
                      this.servicioProducto.actualizar(producto).subscribe(resActualizado=>{})

                      let producto2: Productos = new Productos();
                      producto2.estado = resProductoSecundario.estado
                      producto2.fechaCreacion = resProductoSecundario.fechaCreacion
                      producto2.id = resProductoSecundario.id
                      producto2.idCliente = resProductoSecundario.idCliente
                      producto2.numeroCuenta = resProductoSecundario.numeroCuenta
                      producto2.tipoCuenta = resProductoSecundario.tipoCuenta
                      producto2.saldo = resProductoSecundario.saldo + this.formulario.controls['saldo'].value
                      this.servicioProducto.actualizar(producto2).subscribe(resActualizado=>{})
                      this.registrar(transaccion)
                    }else{
                      Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'La transferencia excede la cantidad disponible de saldo!',
                        showConfirmButton: false,
                        timer: 2500
                      })
                    }
                  })
                })
              })
            })
          })
        }
      })
    }else{
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Los campos no pueden estar vacios!",
      });
    }
  }

  private registrar(transaccion: Transacciones) {
    this.servicioTransaccion.registrar(transaccion).subscribe(res=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Transaccion Registrada!',
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        window.location.reload()
      }, 2500)
    }, error =>{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al agregar!',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }
}
