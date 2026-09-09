import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../modules/autenticacion/services/auth.service';

interface MenuItem { label: string; path: string; roles?: string[]; }
interface MenuGroup { title: string; items: MenuItem[]; }
const ADMIN = ['ADMINISTRADOR'];

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-main-layout',
  styleUrl: './main-layout.css',
  templateUrl: './main-layout.html',
})
export class MainLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly usuario = this.authService.usuarioActual;
  protected readonly sidebarAbierto = signal(false);

  private readonly todosLosMenus: MenuGroup[] = [
    { title: 'CUENTA', items: [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Perfil', path: '/perfil' },
    ]},
    { title: 'SEGURIDAD', items: [
      { label: 'Usuarios', path: '/usuarios', roles: ADMIN },
      { label: 'Roles y permisos', path: '/roles', roles: ADMIN },
      { label: 'Bitácora', path: '/bitacora', roles: ADMIN },
    ]},
    { title: 'ADMINISTRACIÓN', items: [
      { label: 'Ciudades', path: '/ciudades', roles: ADMIN },
      { label: 'Sucursales', path: '/sucursales', roles: ADMIN },
      { label: 'Empleados', path: '/empleados', roles: ADMIN },
      { label: 'Proveedores', path: '/proveedores', roles: ADMIN },
      { label: 'Categorías', path: '/categorias', roles: ADMIN },
      { label: 'Tallas', path: '/tallas', roles: ADMIN },
      { label: 'Colores', path: '/colores', roles: ADMIN },
      { label: 'Temporadas', path: '/temporadas', roles: ADMIN },
      { label: 'Colecciones', path: '/colecciones', roles: ADMIN },
      { label: 'Marcas', path: '/marcas', roles: ADMIN },
      { label: 'Productos', path: '/productos', roles: ADMIN },
      { label: 'Variantes', path: '/variantes', roles: ADMIN },
    ]},
  ];

  protected readonly menuGroups = computed(() => {
    const roles = this.usuario()?.roles ?? [];
    return this.todosLosMenus
      .map((group) => ({ ...group, items: group.items.filter(
        (item) => item.roles === undefined || item.roles.some((role) => roles.includes(role))
      )}))
      .filter((group) => group.items.length > 0);
  });

  protected cerrarSesion(): void {
    this.authService.logout().subscribe({ next: () => void this.router.navigateByUrl('/login') });
  }
  protected alternarSidebar(): void { this.sidebarAbierto.update((abierto) => !abierto); }
  protected cerrarSidebar(): void { this.sidebarAbierto.set(false); }
}
