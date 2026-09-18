import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ReservaResponse } from '../../models/reservas.models';
import { ReservasService } from '../../services/reservas.service';

@Component({
  imports: [RouterLink],
  selector: 'app-reserva-detalle-page',
  styleUrl: './reserva-detalle.page.css',
  templateUrl: './reserva-detalle.page.html',
})
export class ReservaDetallePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly reservasService = inject(ReservasService);

  protected readonly reserva = signal<ReservaResponse | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal('');

  ngOnInit(): void {
    const reservaId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(reservaId)) {
      this.error.set('Reserva no valida.');
      return;
    }

    this.cargarReserva(reservaId);
  }

  protected cancelar(): void {
    const reserva = this.reserva();

    if (reserva === null) {
      return;
    }

    this.guardando.set(true);
    this.error.set('');

    this.reservasService
      .cancelarReserva(reserva.id)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (actualizada) => this.reserva.set(actualizada),
        error: (error: HttpErrorResponse) => this.error.set(this.obtenerMensajeError(error)),
      });
  }

  protected puedeCancelar(reserva: ReservaResponse): boolean {
    return !['COMPLETADA', 'CANCELADA', 'VENCIDA'].includes(reserva.estado);
  }

  protected formatPrecio(value: number | string | null | undefined): string {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) && parsed > 0 ? `Bs ${parsed.toFixed(2)}` : 'Bs 0.00';
  }

  protected formatFecha(value: string | null | undefined): string {
    return value ? new Date(value).toLocaleString('es-BO') : 'Sin fecha';
  }

  private cargarReserva(id: number): void {
    this.cargando.set(true);
    this.error.set('');

    this.reservasService
      .obtenerReserva(id)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (reserva) => this.reserva.set(reserva),
        error: (error: HttpErrorResponse) => this.error.set(this.obtenerMensajeError(error)),
      });
  }

  private obtenerMensajeError(error: HttpErrorResponse): string {
    if (typeof error.error === 'object' && error.error !== null && 'detail' in error.error) {
      const detail = error.error.detail;

      if (typeof detail === 'string') {
        return detail;
      }
    }

    return 'No se pudo cargar la reserva.';
  }
}
