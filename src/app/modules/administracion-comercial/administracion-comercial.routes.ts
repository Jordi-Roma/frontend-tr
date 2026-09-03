import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { CiudadesPage } from './pages/ciudades/ciudades.page';
import { EmpleadosPage } from './pages/empleados/empleados.page';
import { SucursalesPage } from './pages/sucursales/sucursales.page';

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
];
