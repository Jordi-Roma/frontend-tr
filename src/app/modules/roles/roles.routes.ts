import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { RolesPage } from './pages/roles/roles.page';

export const ROLES_ROUTES: Routes = [
  {
    path: 'roles',
    component: RolesPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
];
