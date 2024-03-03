import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Clientes } from '../../../models/clientes';
import { ClientesService } from '../../../services/clientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-cliente',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './agregar-cliente.component.html',
  styleUrl: './agregar-cliente.component.css'
})
export class AgregarClienteComponent {

  public formulario!: FormGroup;
  public fechaActual: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private servicioCliente: ClientesService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.formulario = this.fb.group({
      id: 0,
      nombres: [null, [Validators.required, Validators.minLength(2)]],
      apellidos: [null, [Validators.required, Validators.minLength(2)]],
      tipoIdentificacion: [null, Validators.required],
      numeroIdentificacion: [null, Validators.required],
      correo: [null, [Validators.required, Validators.email]],
      fechaNacimiento: [null, Validators.required]
    });
  }

  public guardarCliente() {
    if(this.formulario.valid) {
      var fechaMenor = this.fechaActual.getFullYear() - 18
      if (this.formulario.controls['fechaNacimiento'].value.getFullYear() < fechaMenor) {
        let cliente: Clientes = new Clientes();
        cliente.nombres = this.formulario.controls['nombres'].value
        cliente.apellidos = this.formulario.controls['apellidos'].value
        cliente.tipoIdentificacion = this.formulario.controls['tipoIdentificacion'].value
        cliente.numeroIdentificacion = this.formulario.controls['numeroIdentificacion'].value
        cliente.correo = this.formulario.controls['correo'].value
        cliente.fechaNacimiento = this.formulario.controls['fechaNacimiento'].value
        this.registrar(cliente)
      }else{
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El cliente no puede ser menor de edad!",
        });
      }
    }else{
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Los campos no pueden estar vacios!",
      });
    }
  }

  private registrar(cliente: Clientes) {
    this.servicioCliente.registrar(cliente).subscribe(res=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cliente Registrado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.router.navigate(['']);
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
