export interface CiudadResponse {
  id: number;
  nombre: string;
  departamento: string | null;
  activo: boolean;
}

export interface CrearCiudadRequest {
  nombre: string;
  departamento: string | null;
}

export interface ActualizarCiudadRequest {
  nombre: string;
  departamento: string | null;
}

export interface SucursalResponse {
  id: number;
  ciudad_id: number;
  ciudad_nombre: string;
  nombre: string;
  direccion: string;
  telefono: string | null;
  activo: boolean;
}

export interface CrearSucursalRequest {
  ciudad_id: number;
  nombre: string;
  direccion: string;
  telefono: string | null;
}

export interface ActualizarSucursalRequest {
  ciudad_id: number;
  nombre: string;
  direccion: string;
  telefono: string | null;
}

export interface MensajeResponse {
  mensaje: string;
}
