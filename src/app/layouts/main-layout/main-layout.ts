import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../modules/autenticacion/services/auth.service';

interface MenuItem {
  label: string;
  path: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

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

  protected readonly menuGroups: MenuGroup[] = [
    {
      title: 'SEGURIDAD',
      items: [
        { label: 'Inicio', path: '/inicio' },
        { label: 'Perfil', path: '/perfil' },
        { label: 'Usuarios', path: '/usuarios' },
        { label: 'Roles y permisos', path: '/roles' },
        { label: 'Bitácora', path: '/bitacora' },
      ],
    },
    {
      title: 'ADMINISTRACIÓN',
      items: [
        { label: 'Ciudades', path: '/ciudades' },
        { label: 'Sucursales', path: '/sucursales' },
        { label: 'Empleados', path: '/empleados' },
        { label: 'Proveedores', path: '/proveedores' },
        { label: 'Categorías', path: '/categorias' },
        { label: 'Tallas', path: '/tallas' },
        { label: 'Colores', path: '/colores' },
        { label: 'Temporadas', path: '/temporadas' },
        { label: 'Colecciones', path: '/colecciones' },
        { label: 'Marcas', path: '/marcas' },
        { label: 'Productos', path: '/productos' },
        { label: 'Variantes', path: '/variantes' },
      ],
    },
    {
      title: 'CATÁLOGO',
      items: [
        { label: 'Catálogo', path: '/catalogo' },
        { label: 'Disponibilidad', path: '/disponibilidad' },
        { label: 'Favoritos', path: '/favoritos' },
        { label: 'Vestidor virtual', path: '/vestidor-virtual' },
      ],
    },
    {
      title: 'RESERVAS',
      items: [
        { label: 'Carrito', path: '/carrito' },
        { label: 'Reservas', path: '/reservas' },
      ],
    },
    {
      title: 'OPERACIONES',
      items: [
        { label: 'Ventas', path: '/ventas' },
        { label: 'Inventario', path: '/inventario' },
        { label: 'Movimientos', path: '/movimientos' },
        { label: 'Transferencias', path: '/transferencias' },
      ],
    },
    {
      title: 'IA Y REPORTES',
      items: [
        { label: 'Reportes', path: '/reportes' },
        { label: 'Recomendaciones', path: '/recomendaciones' },
        { label: 'Chatbot', path: '/chatbot' },
      ],
    },
  ];

  protected cerrarSesion(): void {
    this.authService.logout().subscribe({
      next: () => {
        void this.router.navigateByUrl('/login');
      },
    });
  }

  protected alternarSidebar(): void {
    this.sidebarAbierto.update((abierto) => !abierto);
  }

  protected cerrarSidebar(): void {
    this.sidebarAbierto.set(false);
  }
}
