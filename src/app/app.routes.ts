import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { ForbiddenPage } from './shared/pages/forbidden/forbidden.page';
import { NotFoundPage } from './shared/pages/not-found/not-found.page';

export const routes: Routes = [
  { path: '403', component: ForbiddenPage },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/autenticacion/autenticacion.routes').then(
        (m) => m.AUTENTICACION_ROUTES
      ),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () =>
          import('./modules/inicio/inicio.routes').then((m) => m.INICIO_ROUTES),
      },
      {
        path: '',
        loadChildren: () =>
          import('./modules/perfil/perfil.routes').then((m) => m.PERFIL_ROUTES),
      },
      {
        path: '',
        loadChildren: () =>
          import('./modules/usuarios/usuarios.routes').then(
            (m) => m.USUARIOS_ROUTES
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./modules/roles/roles.routes').then((m) => m.ROLES_ROUTES),
      },
      {
        path: '',
        loadChildren: () =>
          import('./modules/bitacora/bitacora.routes').then(
            (m) => m.BITACORA_ROUTES
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import(
            './modules/administracion-comercial/administracion-comercial.routes'
          ).then((m) => m.ADMINISTRACION_COMERCIAL_ROUTES),
      },
    ],
  },
  { path: '**', component: NotFoundPage },
];
