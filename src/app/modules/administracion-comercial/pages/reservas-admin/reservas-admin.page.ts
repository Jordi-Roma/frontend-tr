import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../autenticacion/services/auth.service';
import { CatalogoSucursal } from '../../../inicio/models/catalogo-publico.models';
import { ReservaResponse } from '../../../inicio/models/reservas.models';
import { CatalogoPublicoService } from '../../../inicio/services/catalogo-publico.service';
import { ReservasService } from '../../../inicio/services/reservas.service';

const ESTADOS = ['PENDIENTE', 'PREPARADA', 'EN_ATENCION', 'COMPLETADA', 'CANCELADA', 'VENCIDA'];

@Component({
  selector: 'app-reservas-admin-page',
  styleUrls: ['../admin-crud.shared.css', './reservas-admin.page.css'],
  templateUrl: './reservas-admin.page.html',
})
export class ReservasAdminPage implements OnInit {
  private readonly reservasService = inject(ReservasService);
  private readonly catalogoService = inject(CatalogoPublicoService);
  private readonly authService = inject(AuthService);

  protected readonly estados = ESTADOS;
  protected readonly esAdmin = signal(this.authService.tieneRol('ADMINISTRADOR'));
  protected readonly reservas = signal<ReservaResponse[]>([]);
  protected readonly sucursales = signal<CatalogoSucursal[]>([]);
  protected readonly reservaSeleccionada = signal<ReservaResponse | null>(null);
  protected readonly estadoFiltro = signal('');
  protected readonly sucursalFiltro = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal('');
  protected readonly mensaje = signal('');

  ngOnInit(): void {
    this.cargarSucursales();
    this.cargarReservas();
  }

  protected cambiarFiltro(event: Event): void {
    this.estadoFiltro.set((event.target as HTMLSelectElement).value);
    this.cargarReservas();
  }

  protected cambiarSucursal(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sucursalFiltro.set(value === '' ? null : Number(value));
    this.cargarReservas();
  }

  protected verDetalle(reserva: ReservaResponse): void {
    this.reservaSeleccionada.set(reserva);
  }

  protected cerrarDetalle(): void {
    this.reservaSeleccionada.set(null);
  }

  protected cambiarEstado(reserva: ReservaResponse, event: Event): void {
    const estado = (event.target as HTMLSelectElement).value;

    if (estado === reserva.estado) {
      return;
    }

    this.guardando.set(true);
    this.error.set('');
    this.mensaje.set('');

    this.reservasService
      .cambiarEstado(reserva.id, { estado })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (actualizada) => {
          this.reservas.update((items) =>
            items.map((item) => (item.id === actualizada.id ? actualizada : item))
          );
          this.reservaSeleccionada.update((item) =>
            item?.id === actualizada.id ? actualizada : item
          );
          this.mensaje.set(`Reserva ${actualizada.codigo} actualizada a ${actualizada.estado}.`);
        },
        error: (error: HttpErrorResponse) => this.error.set(this.obtenerMensajeError(error)),
      });
  }

  protected formatPrecio(value: number | string | null | undefined): string {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) && parsed > 0 ? `Bs ${parsed.toFixed(2)}` : 'Bs 0.00';
  }

  protected formatFecha(value: string | null | undefined): string {
    return value ? new Date(value).toLocaleString('es-BO') : 'Sin fecha';
  }

  protected estadoClase(estado: string): string {
    return `estado-${estado.toLowerCase().replace('_', '-')}`;
  }

  private cargarReservas(): void {
    this.cargando.set(true);
    this.error.set('');

    this.reservasService
      .listarReservas(this.estadoFiltro() || null, this.esAdmin() ? this.sucursalFiltro() : null)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (reservas) => this.reservas.set(reservas),
        error: (error: HttpErrorResponse) => this.error.set(this.obtenerMensajeError(error)),
      });
  }

  private cargarSucursales(): void {
    if (!this.esAdmin()) {
      return;
    }

    this.catalogoService.obtenerFiltros().subscribe({
      next: (filtros) => this.sucursales.set(filtros.sucursales),
      error: () => this.sucursales.set([]),
    });
  }

  private obtenerMensajeError(error: HttpErrorResponse): string {
    if (typeof error.error === 'object' && error.error !== null && 'detail' in error.error) {
      const detail = error.error.detail;

      if (typeof detail === 'string') {
        return detail;
      }
    }

    return 'No se pudieron cargar o actualizar las reservas.';
  }
}
