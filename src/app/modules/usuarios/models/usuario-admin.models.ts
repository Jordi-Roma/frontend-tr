export interface UsuarioAdminResponse {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  correo: string;
  activo: boolean;
  roles: string[];
  es_cliente: boolean;
  es_empleado: boolean;
}

export interface ActualizarUsuarioRequest {
  nombre: string;
  apellido: string;
  username: string;
  correo: string;
}

export interface MensajeResponse {
  mensaje: string;
}
