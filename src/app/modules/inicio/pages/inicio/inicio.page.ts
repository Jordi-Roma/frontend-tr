import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../autenticacion/services/auth.service';

interface QuickAccess {
  label: string;
  path: string;
  description: string;
}

@Component({
  imports: [RouterLink],
  selector: 'app-inicio-page',
  styleUrl: './inicio.page.css',
  templateUrl: './inicio.page.html',
})
export class InicioPage {
  private readonly authService = inject(AuthService);

  protected readonly usuario = this.authService.usuarioActual;

  protected readonly quickAccess: QuickAccess[] = [
    {
      label: 'Perfil',
      path: '/perfil',
      description: 'Configurar datos personales y contraseña.',
    },
    {
      label: 'Usuarios',
      path: '/usuarios',
      description: 'Gestionar usuarios y roles del sistema.',
    },
    {
      label: 'Roles y permisos',
      path: '/roles',
      description: 'Administrar permisos por rol.',
    },
    {
      label: 'Ciudades',
      path: '/ciudades',
      description: 'Mantener ciudades activas del negocio.',
    },
    {
      label: 'Sucursales',
      path: '/sucursales',
      description: 'Gestionar puntos físicos de atención.',
    },
    {
      label: 'Empleados',
      path: '/empleados',
      description: 'Administrar empleados por sucursal.',
    },
  ];
}
