import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import {
  ActualizarCategoriaRequest,
  ActualizarColorRequest,
  ActualizarTallaRequest,
  CategoriaResponse,
  ColorResponse,
  CrearCategoriaRequest,
  CrearColorRequest,
  CrearTallaRequest,
  MensajeResponse,
  TallaResponse,
} from '../models/catalogo.models';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly categoriasUrl = `${API_BASE_URL}/api/v1/categorias`;
  private readonly tallasUrl = `${API_BASE_URL}/api/v1/tallas`;
  private readonly coloresUrl = `${API_BASE_URL}/api/v1/colores`;

  // ── CATEGORÍAS ────────────────────────────────────────────────────────────

  listarCategorias(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(this.categoriasUrl);
  }

  obtenerCategoria(categoriaId: number): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${this.categoriasUrl}/${categoriaId}`);
  }

  crearCategoria(request: CrearCategoriaRequest): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(this.categoriasUrl, request);
  }

  actualizarCategoria(
    categoriaId: number,
    request: ActualizarCategoriaRequest
  ): Observable<CategoriaResponse> {
    return this.http.put<CategoriaResponse>(
      `${this.categoriasUrl}/${categoriaId}`,
      request
    );
  }

  desactivarCategoria(categoriaId: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(
      `${this.categoriasUrl}/${categoriaId}/desactivar`,
      {}
    );
  }

  activarCategoria(categoriaId: number): Observable<CategoriaResponse> {
    return this.http.patch<CategoriaResponse>(
      `${this.categoriasUrl}/${categoriaId}/activar`,
      {}
    );
  }

  // ── TALLAS ────────────────────────────────────────────────────────────────

  listarTallas(): Observable<TallaResponse[]> {
    return this.http.get<TallaResponse[]>(this.tallasUrl);
  }

  obtenerTalla(tallaId: number): Observable<TallaResponse> {
    return this.http.get<TallaResponse>(`${this.tallasUrl}/${tallaId}`);
  }

  crearTalla(request: CrearTallaRequest): Observable<TallaResponse> {
    return this.http.post<TallaResponse>(this.tallasUrl, request);
  }

  actualizarTalla(
    tallaId: number,
    request: ActualizarTallaRequest
  ): Observable<TallaResponse> {
    return this.http.put<TallaResponse>(`${this.tallasUrl}/${tallaId}`, request);
  }

  desactivarTalla(tallaId: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(
      `${this.tallasUrl}/${tallaId}/desactivar`,
      {}
    );
  }

  activarTalla(tallaId: number): Observable<TallaResponse> {
    return this.http.patch<TallaResponse>(
      `${this.tallasUrl}/${tallaId}/activar`,
      {}
    );
  }

  // ── COLORES ───────────────────────────────────────────────────────────────

  listarColores(): Observable<ColorResponse[]> {
    return this.http.get<ColorResponse[]>(this.coloresUrl);
  }

  obtenerColor(colorId: number): Observable<ColorResponse> {
    return this.http.get<ColorResponse>(`${this.coloresUrl}/${colorId}`);
  }

  crearColor(request: CrearColorRequest): Observable<ColorResponse> {
    return this.http.post<ColorResponse>(this.coloresUrl, request);
  }

  actualizarColor(
    colorId: number,
    request: ActualizarColorRequest
  ): Observable<ColorResponse> {
    return this.http.put<ColorResponse>(`${this.coloresUrl}/${colorId}`, request);
  }

  desactivarColor(colorId: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(
      `${this.coloresUrl}/${colorId}/desactivar`,
      {}
    );
  }

  activarColor(colorId: number): Observable<ColorResponse> {
    return this.http.patch<ColorResponse>(
      `${this.coloresUrl}/${colorId}/activar`,
      {}
    );
  }
}
