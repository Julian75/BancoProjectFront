import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ClientesService } from '../../../services/clientes.service';
import { Clientes } from '../../../models/clientes';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modificar-cliente',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './modificar-cliente.component.html',
  styleUrl: './modificar-cliente.component.css'
})
export class ModificarClienteComponent {

  public formulario!: FormGroup;
  public fechaActual: Date = new Date();
  public idCliente: number = 0;
  public informacionCliente: any;

  constructor(
    private fb: FormBuilder,
    private servicioCliente: ClientesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.listarClienteId();
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

  private listarClienteId() {
    this.idCliente = Number(this.route.snapshot.paramMap.get('id'));
    this.servicioCliente.listarPorId(this.idCliente).subscribe(res=>{
      this.formulario.controls['nombres'].setValue(res.nombres)
      this.formulario.controls['apellidos'].setValue(res.apellidos)
      this.formulario.controls['tipoIdentificacion'].setValue(res.tipoIdentificacion)
      this.formulario.controls['numeroIdentificacion'].setValue(res.numeroIdentificacion)
      this.formulario.controls['correo'].setValue(res.correo)
      var fecha = new Date(res.fechaNacimiento)
      fecha.setDate(fecha.getDate()+1)
      this.formulario.controls['fechaNacimiento'].setValue(fecha)
      this.informacionCliente = res
    })
  }

  public modificarCliente() {
    if(this.formulario.valid) {
      var fechaMenor = this.fechaActual.getFullYear() - 18
      if (this.formulario.controls['fechaNacimiento'].value.getFullYear() < fechaMenor) {
        let cliente: Clientes = new Clientes();
        cliente.id = this.idCliente
        cliente.nombres = this.formulario.controls['nombres'].value
        cliente.apellidos = this.formulario.controls['apellidos'].value
        cliente.tipoIdentificacion = this.formulario.controls['tipoIdentificacion'].value
        cliente.numeroIdentificacion = this.formulario.controls['numeroIdentificacion'].value
        cliente.correo = this.formulario.controls['correo'].value
        cliente.fechaNacimiento = this.formulario.controls['fechaNacimiento'].value
        cliente.fechaCreacion = this.informacionCliente.fechaCreacion
        this.modificar(cliente)
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

  private modificar(cliente: Clientes) {
    this.servicioCliente.actualizar(cliente).subscribe(res=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cliente Modificado!',
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

  compareFunction(o1: any, o2: any) {
    return o1.id === o2.id;
  }
}
