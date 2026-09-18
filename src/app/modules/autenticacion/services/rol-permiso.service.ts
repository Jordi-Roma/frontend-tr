import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import {
  ActualizarRolRequest,
  CrearPermisoRequest,
  CrearRolRequest,
  MensajeResponse,
  PermisoResponse,
  RolResponse,
} from '../models/rol-permiso.models';

@Injectable({
  providedIn: 'root',
})
export class RolPermisoService {
  private readonly http = inject(HttpClient);
  private readonly rolesUrl = `${API_BASE_URL}/api/v1/roles`;
  private readonly permisosUrl = `${API_BASE_URL}/api/v1/permisos`;

  listarRoles(): Observable<RolResponse[]> {
    return this.http.get<RolResponse[]>(this.rolesUrl);
  }

  crearRol(request: CrearRolRequest): Observable<RolResponse> {
    return this.http.post<RolResponse>(this.rolesUrl, request);
  }

  actualizarRol(
    rolId: number,
    request: ActualizarRolRequest
  ): Observable<RolResponse> {
    return this.http.put<RolResponse>(`${this.rolesUrl}/${rolId}`, request);
  }

  desactivarRol(rolId: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(
      `${this.rolesUrl}/${rolId}/desactivar`,
      {}
    );
  }

  activarRol(rolId: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(
      `${this.rolesUrl}/${rolId}/activar`,
      {}
    );
  }

  listarPermisos(): Observable<PermisoResponse[]> {
    return this.http.get<PermisoResponse[]>(this.permisosUrl);
  }

  crearPermiso(request: CrearPermisoRequest): Observable<PermisoResponse> {
    return this.http.post<PermisoResponse>(this.permisosUrl, request);
  }

  desactivarPermiso(permisoId: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(
      `${this.permisosUrl}/${permisoId}/desactivar`,
      {}
    );
  }

  activarPermiso(permisoId: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(
      `${this.permisosUrl}/${permisoId}/activar`,
      {}
    );
  }

  asignarPermiso(rolId: number, permisoId: number): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>(
      `${this.rolesUrl}/${rolId}/permisos/${permisoId}`,
      {}
    );
  }

  desactivarPermisoRol(
    rolId: number,
    permisoId: number
  ): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(
      `${this.rolesUrl}/${rolId}/permisos/${permisoId}/desactivar`,
      {}
    );
  }

  activarPermisoRol(
    rolId: number,
    permisoId: number
  ): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(
      `${this.rolesUrl}/${rolId}/permisos/${permisoId}/activar`,
      {}
    );
  }
}
