export interface CrearCheckoutStripeRequest {
  sucursal_id?: number | null;
}

export interface CheckoutStripeResponse {
  orden_id: number;
  venta_id: number;
  estado: string;
  checkout_url: string;
}

export interface OrdenPagoResponse {
  orden_id: number;
  venta_id: number;
  cliente_id?: number | null;
  monto_total: number | string;
  moneda: string;
  metodo: string;
  estado: string;
  proveedor: string;
  checkout_url?: string | null;
  proveedor_session_id?: string | null;
  fecha_pago?: string | null;
}

export interface ConfirmarPagoPruebaRequest {
  aprobar: boolean;
}
