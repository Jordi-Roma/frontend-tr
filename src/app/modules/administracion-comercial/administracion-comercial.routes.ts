import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { CategoriasPage } from './pages/categorias/categorias.page';
import { CiudadesPage } from './pages/ciudades/ciudades.page';
import { ColoresPage } from './pages/colores/colores.page';
import { EmpleadosPage } from './pages/empleados/empleados.page';
import { ProveedoresPage } from './pages/proveedores/proveedores.page';
import { SucursalesPage } from './pages/sucursales/sucursales.page';
import { TallasPage } from './pages/tallas/tallas.page';
import { TemporadasPage } from './pages/temporadas/temporadas.page';
import { ColeccionesPage } from './pages/colecciones/colecciones.page';
import { MarcasPage } from './pages/marcas/marcas.page';
import { ProductosPage } from './pages/productos/productos.page';
import { VariantesPage } from './pages/variantes/variantes.page';
import { ReservasAdminPage } from './pages/reservas-admin/reservas-admin.page';
import { InventarioPage } from './pages/inventario/inventario.page';
import { MovimientosInventarioPage } from './pages/movimientos-inventario/movimientos-inventario.page';
import { TransferenciasStockPage } from './pages/transferencias-stock/transferencias-stock.page';
import { VentaPresencialPage } from './pages/venta-presencial/venta-presencial.page';

export const ADMINISTRACION_COMERCIAL_ROUTES: Routes = [
  {
    path: 'ciudades',
    component: CiudadesPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'sucursales',
    component: SucursalesPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'empleados',
    component: EmpleadosPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'proveedores',
    component: ProveedoresPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'categorias',
    component: CategoriasPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'tallas',
    component: TallasPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'colores',
    component: ColoresPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'temporadas',
    component: TemporadasPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'colecciones',
    component: ColeccionesPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'marcas',
    component: MarcasPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'productos',
    component: ProductosPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'variantes',
    component: VariantesPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
  },
  {
    path: 'reservas-admin',
    component: ReservasAdminPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL'],
    },
  },
  {
    path: 'inventario',
    component: InventarioPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'CAJERO'],
    },
  },
  {
    path: 'movimientos-inventario',
    component: MovimientosInventarioPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL'],
    },
  },
  {
    path: 'transferencias-stock',
    component: TransferenciasStockPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL'],
    },
  },
  {
    path: 'venta-presencial',
    component: VentaPresencialPage,
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'ENCARGADO_SUCURSAL', 'CAJERO'],
    },
  },
];
