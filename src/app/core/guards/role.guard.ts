import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../modules/autenticacion/services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const rolesEsperados = route.data['roles'];

  if (!Array.isArray(rolesEsperados)) {
    return true;
  }

  const tienePermiso = rolesEsperados.some(
    (rol) => typeof rol === 'string' && authService.tieneRol(rol)
  );

  if (tienePermiso) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
