import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TiendaStateService } from '../../core/services/tienda-state.service';
import { AuthService } from '../../modules/autenticacion/services/auth.service';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: string[];
}

interface MenuGroup {
  title: string;
  icon: string;
  items: MenuItem[];
}

const ADMIN = ['ADMINISTRADOR'];
const ADMIN_O_ENCARGADO = ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL'];
const ADMIN_ENCARGADO_CAJERO = ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'CAJERO'];

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-main-layout',
  styleUrl: './main-layout.css',
  templateUrl: './main-layout.html',
})
export class MainLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly tiendaState = inject(TiendaStateService);

  protected readonly usuario = this.authService.usuarioActual;
  protected readonly sidebarAbierto = signal(false);
  protected readonly cuentaAbierta = signal(false);
  protected readonly esAdmin = computed(() => this.authService.tieneRol('ADMINISTRADOR'));
  protected readonly usaPanelAdmin = computed(
    () =>
      this.authService.tieneRol('ADMINISTRADOR') ||
      this.authService.tieneRol('ENCARGADO_SUCURSAL') ||
      this.authService.tieneRol('CAJERO')
  );
  protected readonly totalCarrito = computed(() =>
    this.tiendaState.carrito().reduce((total, item) => total + item.cantidad, 0)
  );

  protected readonly tiendaMenu: MenuItem[] = [
    { label: 'Inicio', path: '/inicio', icon: 'pi pi-home' },
    { label: 'Catalogo', path: '/catalogo', icon: 'pi pi-shopping-bag' },
    { label: 'Poleras', path: '/poleras', icon: 'pi pi-tag' },
    { label: 'Oversize', path: '/oversize', icon: 'pi pi-sparkles' },
    { label: 'Camisas', path: '/camisas', icon: 'pi pi-bookmark' },
    { label: 'Reservas', path: '/reservas', icon: 'pi pi-calendar-check' },
  ];

  private readonly todosLosMenus: MenuGroup[] = [
    {
      title: 'PANEL',
      icon: 'pi pi-th-large',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: 'pi pi-chart-line', roles: ADMIN },
        { label: 'Perfil', path: '/perfil', icon: 'pi pi-user' },
      ],
    },
    {
      title: 'SEGURIDAD',
      icon: 'pi pi-shield',
      items: [
        { label: 'Usuarios', path: '/usuarios', icon: 'pi pi-users', roles: ADMIN },
        { label: 'Roles y permisos', path: '/roles', icon: 'pi pi-shield', roles: ADMIN },
        { label: 'Bitacora', path: '/bitacora', icon: 'pi pi-history', roles: ADMIN },
      ],
    },
    {
      title: 'ADMINISTRACION',
      icon: 'pi pi-briefcase',
      items: [
        { label: 'Productos', path: '/productos', icon: 'pi pi-shopping-bag', roles: ADMIN },
        { label: 'Categorias', path: '/categorias', icon: 'pi pi-tags', roles: ADMIN },
        { label: 'Tallas', path: '/tallas', icon: 'pi pi-sliders-h', roles: ADMIN },
        { label: 'Colores', path: '/colores', icon: 'pi pi-palette', roles: ADMIN },
        { label: 'Marcas', path: '/marcas', icon: 'pi pi-bookmark', roles: ADMIN },
        { label: 'Temporadas', path: '/temporadas', icon: 'pi pi-calendar', roles: ADMIN },
        { label: 'Colecciones', path: '/colecciones', icon: 'pi pi-th-large', roles: ADMIN },
        { label: 'Proveedores', path: '/proveedores', icon: 'pi pi-truck', roles: ADMIN },
        { label: 'Ciudades', path: '/ciudades', icon: 'pi pi-map-marker', roles: ADMIN },
        { label: 'Sucursales', path: '/sucursales', icon: 'pi pi-building', roles: ADMIN },
        { label: 'Empleados', path: '/empleados', icon: 'pi pi-id-card', roles: ADMIN },
        { label: 'Variantes', path: '/variantes', icon: 'pi pi-sitemap', roles: ADMIN },
        { label: 'Reservas', path: '/reservas-admin', icon: 'pi pi-calendar-check', roles: ADMIN_O_ENCARGADO },
      ],
    },
    {
      title: 'VENTAS E INVENTARIO',
      icon: 'pi pi-warehouse',
      items: [
        { label: 'Inventario', path: '/inventario', icon: 'pi pi-box', roles: ADMIN_ENCARGADO_CAJERO },
        { label: 'Movimientos', path: '/movimientos-inventario', icon: 'pi pi-arrow-right-arrow-left', roles: ADMIN_O_ENCARGADO },
        { label: 'Transferencias', path: '/transferencias-stock', icon: 'pi pi-truck', roles: ADMIN_O_ENCARGADO },
        { label: 'Venta presencial', path: '/venta-presencial', icon: 'pi pi-receipt', roles: ADMIN_ENCARGADO_CAJERO },
      ],
    },
  ];

  protected readonly menuGroups = computed(() => {
    const roles = this.usuario()?.roles ?? [];

    return this.todosLosMenus
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) => item.roles === undefined || item.roles.some((role) => roles.includes(role))
        ),
      }))
      .filter((group) => group.items.length > 0);
  });

  protected readonly gruposAbiertos = signal<Set<string>>(new Set(['PANEL']));

  constructor() {
    queueMicrotask(() => {
      const grupoActivo = this.menuGroups().find((group) =>
        group.items.some((item) => this.router.url === item.path || this.router.url.startsWith(`${item.path}/`))
      );

      if (grupoActivo) {
        this.gruposAbiertos.update((actuales) => new Set(actuales).add(grupoActivo.title));
      }
    });
  }

  protected grupoAbierto(title: string): boolean {
    return this.gruposAbiertos().has(title);
  }

  protected alternarGrupo(title: string): void {
    this.gruposAbiertos.update((actuales) => {
      const siguiente = new Set(actuales);
      if (siguiente.has(title)) {
        siguiente.delete(title);
      } else {
        siguiente.add(title);
      }
      return siguiente;
    });
  }

  protected cerrarSesion(): void {
    this.authService.logout().subscribe({ next: () => void this.router.navigateByUrl('/login') });
  }

  protected alternarCuenta(): void {
    this.cuentaAbierta.update((abierta) => !abierta);
  }

  protected irPerfil(): void {
    this.cuentaAbierta.set(false);
    this.cerrarSidebar();
    void this.router.navigateByUrl('/perfil');
  }

  protected alternarSidebar(): void {
    this.sidebarAbierto.update((abierto) => !abierto);
  }

  protected cerrarSidebar(): void {
    this.sidebarAbierto.set(false);
  }
}
