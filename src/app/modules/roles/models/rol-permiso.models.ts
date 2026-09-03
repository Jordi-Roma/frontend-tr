export interface RolResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export interface PermisoResponse {
  id: number;
  nombre: string;
  modulo: string;
  accion: string;
  descripcion: string | null;
  activo: boolean;
}

export interface CrearRolRequest {
  nombre: string;
  descripcion: string | null;
}

export interface ActualizarRolRequest {
  nombre: string;
  descripcion: string | null;
}

export interface CrearPermisoRequest {
  nombre: string;
  modulo: string;
  accion: string;
  descripcion: string | null;
}

export interface MensajeResponse {
  mensaje: string;
}
