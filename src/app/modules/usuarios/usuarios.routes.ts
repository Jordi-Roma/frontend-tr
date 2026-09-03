import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UsuariosPage } from './pages/usuarios/usuarios.page';

export const USUARIOS_ROUTES: Routes = [
  {
    path: 'usuarios',
    component: UsuariosPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
];
