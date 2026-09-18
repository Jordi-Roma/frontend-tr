import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { InventarioPage } from './pages/inventario/inventario.page';
import { MovimientosInventarioPage } from './pages/movimientos-inventario/movimientos-inventario.page';
import { PagoResultadoPage } from './pages/pago-resultado/pago-resultado.page';
import { TransferenciasStockPage } from './pages/transferencias-stock/transferencias-stock.page';
import { VentaPresencialPage } from './pages/venta-presencial/venta-presencial.page';

export const VENTAS_INVENTARIO_ROUTES: Routes = [
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
  {
    path: 'pago/resultado',
    component: PagoResultadoPage,
    canActivate: [roleGuard],
    data: {
      roles: ['CLIENTE', 'ADMINISTRADOR'],
    },
  },
  {
    path: 'pago/cancelado',
    component: PagoResultadoPage,
    canActivate: [roleGuard],
    data: {
      roles: ['CLIENTE', 'ADMINISTRADOR'],
    },
  },
];
