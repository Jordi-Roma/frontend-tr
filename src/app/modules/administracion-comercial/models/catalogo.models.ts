// ── CATEGORÍAS ──────────────────────────────────────────────────────────────

export interface CategoriaResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  fecha_creacion: string;
}

export interface CrearCategoriaRequest {
  nombre: string;
  descripcion: string | null;
}

export interface ActualizarCategoriaRequest {
  nombre: string;
  descripcion: string | null;
}

// ── TALLAS ──────────────────────────────────────────────────────────────────

export interface TallaResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  fecha_creacion: string;
}

export interface CrearTallaRequest {
  nombre: string;
  descripcion: string | null;
}

export interface ActualizarTallaRequest {
  nombre: string;
  descripcion: string | null;
}

// ── COLORES ──────────────────────────────────────────────────────────────────

export interface ColorResponse {
  id: number;
  nombre: string;
  codigo_hex: string | null;
  activo: boolean;
  fecha_creacion: string;
}

export interface CrearColorRequest {
  nombre: string;
  codigo_hex: string | null;
}

export interface ActualizarColorRequest {
  nombre: string;
  codigo_hex: string | null;
}

// ── COMPARTIDO ───────────────────────────────────────────────────────────────

export interface MensajeResponse {
  mensaje: string;
}
