import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { BitacoraPage } from './pages/bitacora/bitacora.page';

export const BITACORA_ROUTES: Routes = [
  {
    path: 'bitacora',
    component: BitacoraPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
];
