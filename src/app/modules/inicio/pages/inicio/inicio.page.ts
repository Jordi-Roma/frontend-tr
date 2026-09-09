import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../autenticacion/services/auth.service';

interface QuickAccess {
  label: string;
  path: string;
  description: string;
  adminOnly?: boolean;
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

  private readonly allQuickAccess: QuickAccess[] = [
    { label: 'Perfil', path: '/perfil', description: 'Configura tus datos personales y contraseña.' },
    { label: 'Usuarios', path: '/usuarios', description: 'Gestiona usuarios y roles del sistema.', adminOnly: true },
    { label: 'Roles y permisos', path: '/roles', description: 'Administra permisos por rol.', adminOnly: true },
    { label: 'Ciudades', path: '/ciudades', description: 'Mantén las ciudades activas del negocio.', adminOnly: true },
    { label: 'Sucursales', path: '/sucursales', description: 'Gestiona los puntos físicos de atención.', adminOnly: true },
    { label: 'Empleados', path: '/empleados', description: 'Administra empleados por sucursal.', adminOnly: true },
  ];

  protected readonly quickAccess = computed(() =>
    this.allQuickAccess.filter(
      (item) => item.adminOnly !== true || this.authService.tieneRol('ADMINISTRADOR')
    )
  );
}
