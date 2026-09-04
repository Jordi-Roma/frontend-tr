import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { CategoriasPage } from './pages/categorias/categorias.page';
import { CiudadesPage } from './pages/ciudades/ciudades.page';
import { ColoresPage } from './pages/colores/colores.page';
import { EmpleadosPage } from './pages/empleados/empleados.page';
import { ProveedoresPage } from './pages/proveedores/proveedores.page';
import { SucursalesPage } from './pages/sucursales/sucursales.page';
import { TallasPage } from './pages/tallas/tallas.page';

export const ADMINISTRACION_COMERCIAL_ROUTES: Routes = [
  {
    path: 'ciudades',
    component: CiudadesPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'sucursales',
    component: SucursalesPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'empleados',
    component: EmpleadosPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'proveedores',
    component: ProveedoresPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'categorias',
    component: CategoriasPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'tallas',
    component: TallasPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'colores',
    component: ColoresPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
];
