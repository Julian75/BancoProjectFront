import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { Productos } from '../../../models/productos';
import { ProductosService } from '../../../services/productos.service';
import { ClientesService } from '../../../services/clientes.service';
import { ConsultasService } from '../../../services/consultas.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css'
})
export class AgregarProductoComponent {

  public formulario!: FormGroup;
  public tiposCuentas = ["Ahorro", "Corriente"]
  public listaClientes: any = [];
  public numeroCuenta = 0;

  constructor(
    private fb: FormBuilder,
    private servicioProductos: ProductosService,
    private servicioClientes: ClientesService,
    private servicioConsulta: ConsultasService,
    public dialogRef: MatDialogRef<AgregarProductoComponent>,
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.listarClientes();
  }

  private crearFormulario() {
    this.formulario = this.fb.group({
      id: 0,
      tipoCuenta: [null, Validators.required],
      saldo: [null, Validators.required],
      cliente: [null, Validators.required],
    });
  }

  public listarClientes() {
    this.servicioClientes.listarTodos().subscribe(res=>{
      this.listaClientes = res
    })
  }

  public guardarProducto() {
    var saldo = this.formulario.controls['saldo'].value
    var tipoCuenta = this.formulario.controls['tipoCuenta'].value

    if(this.formulario.valid) {
      this.servicioClientes.listarPorId(this.formulario.controls['cliente'].value).subscribe(res=>{
        let producto: Productos = new Productos();
        producto.estado = "Activa"
        producto.tipoCuenta = tipoCuenta
        producto.idCliente = res
        if (tipoCuenta == 'Ahorro' && saldo > 0) {
          producto.saldo = saldo
          this.numeroCuenta = Number("53"+Math.floor(Math.random() * (99999999 - 10000000) + 10000000))
          this.validacionCuentaExistente(producto)
        }else if(tipoCuenta == 'Corriente') {
          producto.saldo = saldo
          this.numeroCuenta = Number("33"+Math.floor(Math.random() * (99999999 - 10000000) + 10000000))
          this.validacionCuentaExistente(producto)
        }else{
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "En una cuenta de ahorro el saldo no puede ser menor a 0!",
          });
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

  public validacionCuentaExistente(producto: Productos) {
    this.servicioConsulta.existenciaCuenta(this.numeroCuenta).subscribe(res=>{
      console.log(res, producto)
      if(res[0].contadorProducto == 0){
        producto.numeroCuenta = this.numeroCuenta
        this.registrar(producto)
      }else{
        if (producto.tipoCuenta == 'Ahorro') {
          this.numeroCuenta = Number("53"+Math.floor(Math.random() * (99999999 - 10000000) + 10000000))
          this.validacionCuentaExistente(producto)
        }else {
          this.numeroCuenta = Number("33"+Math.floor(Math.random() * (99999999 - 10000000) + 10000000))
          this.validacionCuentaExistente(producto)
        }
      }
    })
  }

  private registrar(producto: Productos) {
    this.servicioProductos.registrar(producto).subscribe(res=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cuenta Registrada!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close()
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
