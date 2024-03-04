import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { AgregarClienteComponent } from './components/clientes/agregar-cliente/agregar-cliente.component';
import { ModificarClienteComponent } from './components/clientes/modificar-cliente/modificar-cliente.component';
import { ProductosComponent } from './components/productos/productos.component';
import { TransaccionesComponent } from './components/transacciones/transacciones.component';
import { AgregarProductoComponent } from './components/productos/agregar-producto/agregar-producto.component';

export const routes: Routes = [
    { 
        path: '', 
        component: ClientesComponent
    },
    { 
        path: 'agregarCliente', 
        component: AgregarClienteComponent
    },
    { 
        path: 'modificarCliente/:id', 
        component: ModificarClienteComponent
    },
    { 
        path: 'productos', 
        component: ProductosComponent
    },
    { 
        path: 'transacciones', 
        component: TransaccionesComponent
    }
];
