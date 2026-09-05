export interface PrecioResponse {
  id: number;
  variante_id: number;
  monto: number;
  fecha_inicio: string;
  fecha_fin: string | null;
  activo: boolean;
  fecha_creacion: string;
}

export interface VarianteResponse {
  id: number;
  producto_id: number;
  producto_nombre: string;
  talla_id: number | null;
  talla_nombre: string | null;
  color_id: number | null;
  color_nombre: string | null;
  sku: string;
  activo: boolean;
  fecha_creacion: string;
  precios: PrecioResponse[];
}

export interface CrearVarianteRequest {
  producto_id: number;
  talla_id: number | null;
  color_id: number | null;
  sku: string;
}

export interface ActualizarVarianteRequest {
  talla_id: number | null;
  color_id: number | null;
  sku: string;
}

export interface AsignarPrecioRequest {
  monto: number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
}
