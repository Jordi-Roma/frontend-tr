import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { RegistroPage } from './pages/registro/registro.page';

export const AUTENTICACION_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'registro',
    component: RegistroPage,
  },
];
