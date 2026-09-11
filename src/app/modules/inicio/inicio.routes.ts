import { Routes } from '@angular/router';
import { CarritoPage } from './pages/carrito/carrito.page';
import { CatalogoPage } from './pages/catalogo/catalogo.page';
import { FavoritosPage } from './pages/favoritos/favoritos.page';
import { AdminDashboardPage } from './pages/admin-dashboard/admin-dashboard.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { ProductoDetallePage } from './pages/producto-detalle/producto-detalle.page';
import { ReservasPage } from './pages/reservas/reservas.page';
import { ReservaDetallePage } from './pages/reserva-detalle/reserva-detalle.page';
import { roleGuard } from '../../core/guards/role.guard';

export const INICIO_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'inicio',
    component: InicioPage,
  },
  {
    path: 'catalogo',
    component: CatalogoPage,
  },
  {
    path: 'poleras',
    component: CatalogoPage,
    data: {
      categoria: 'poleras',
    },
  },
  {
    path: 'oversize',
    component: CatalogoPage,
    data: {
      categoria: 'oversize',
    },
  },
  {
    path: 'camisas',
    component: CatalogoPage,
    data: {
      categoria: 'camisas',
    },
  },
  {
    path: 'favoritos',
    component: FavoritosPage,
  },
  {
    path: 'carrito',
    component: CarritoPage,
  },
  {
    path: 'reservas',
    component: ReservasPage,
  },
  {
    path: 'reservas/:id',
    component: ReservaDetallePage,
  },
  {
    path: 'producto/:id',
    component: ProductoDetallePage,
  },
];
