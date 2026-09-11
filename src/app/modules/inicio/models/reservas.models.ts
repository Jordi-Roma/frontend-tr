export interface ReservaDetalleResponse {
  id: number;
  producto_variante_id: number;
  producto_id: number;
  producto: string;
  categoria: string;
  talla: string;
  color: string;
  cantidad: number;
  precio_unitario: number | string;
  subtotal: number | string;
}

export interface ReservaResponse {
  id: number;
  codigo: string;
  cliente_id: number;
  cliente?: string | null;
  sucursal_id: number;
  sucursal: string;
  ciudad: string;
  estado: string;
  total: number | string;
  fecha_reserva: string;
  fecha_expiracion?: string | null;
  observacion?: string | null;
  detalles: ReservaDetalleResponse[];
}

export interface CrearReservaDesdeCarritoRequest {
  sucursal_id: number;
  observacion?: string | null;
}

export interface CambiarEstadoReservaRequest {
  estado: string;
}
