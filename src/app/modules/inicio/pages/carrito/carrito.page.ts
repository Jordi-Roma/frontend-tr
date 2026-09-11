import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { CarritoItemResponse, CarritoResponse } from '../../models/carrito.models';
import { CatalogoSucursal } from '../../models/catalogo-publico.models';
import { ReservaResponse } from '../../models/reservas.models';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoPublicoService } from '../../services/catalogo-publico.service';
import { ReservasService } from '../../services/reservas.service';

@Component({
  imports: [RouterLink],
  selector: 'app-carrito-page',
  styleUrl: './carrito.page.css',
  templateUrl: './carrito.page.html',
})
export class CarritoPage implements OnInit {
  private readonly carritoService = inject(CarritoService);
  private readonly catalogoService = inject(CatalogoPublicoService);
  private readonly reservasService = inject(ReservasService);
  private readonly router = inject(Router);

  protected readonly carrito = signal<CarritoResponse | null>(null);
  protected readonly sucursales = signal<CatalogoSucursal[]>([]);
  protected readonly sucursalId = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal('');
  protected readonly mensaje = signal('');

  protected readonly items = computed(() => this.carrito()?.items ?? []);
  protected readonly subtotal = computed(() => this.toNumber(this.carrito()?.total));
  protected readonly totalItems = computed(() =>
    this.items().reduce((total, item) => total + item.cantidad, 0)
  );

  ngOnInit(): void {
    this.cargarCarrito();
  }

  protected cambiarCantidad(item: CarritoItemResponse, cantidad: number): void {
    if (cantidad < 1) {
      return;
    }

    this.guardando.set(true);
    this.error.set('');

    this.carritoService
      .actualizarItem(item.id, { cantidad })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (carrito) => this.carrito.set(carrito),
        error: (error: HttpErrorResponse) => this.error.set(this.obtenerMensajeError(error)),
      });
  }

  protected quitar(item: CarritoItemResponse): void {
    this.guardando.set(true);
    this.error.set('');

    this.carritoService
      .eliminarItem(item.id)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (carrito) => this.carrito.set(carrito),
        error: (error: HttpErrorResponse) => this.error.set(this.obtenerMensajeError(error)),
      });
  }

  protected vaciar(): void {
    this.guardando.set(true);
    this.error.set('');

    this.carritoService
      .vaciar()
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (carrito) => this.carrito.set(carrito),
        error: (error: HttpErrorResponse) => this.error.set(this.obtenerMensajeError(error)),
      });
  }

  protected actualizarSucursal(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sucursalId.set(value === '' ? null : Number(value));
  }

  protected confirmarReserva(): void {
    const sucursalId = this.sucursalId();

    if (sucursalId === null) {
      this.error.set('Selecciona una sucursal para confirmar la reserva.');
      return;
    }

    this.guardando.set(true);
    this.error.set('');
    this.mensaje.set('');

    this.reservasService
      .crearDesdeCarrito({ sucursal_id: sucursalId })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (reserva: ReservaResponse) => {
          this.mensaje.set(`Reserva ${reserva.codigo} creada correctamente.`);
          void this.router.navigate(['/reservas', reserva.id]);
        },
        error: (error: HttpErrorResponse) => this.error.set(this.obtenerMensajeError(error)),
      });
  }

  protected formatPrecio(precio: number | string | null | undefined): string {
    const value = this.toNumber(precio);
    return value > 0 ? `Bs ${value.toFixed(2)}` : 'Precio pendiente';
  }

  private cargarCarrito(): void {
    this.cargando.set(true);
    this.error.set('');

    forkJoin({
      carrito: this.carritoService.obtenerCarrito(),
      filtros: this.catalogoService.obtenerFiltros(),
    })
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: ({ carrito, filtros }) => {
          this.carrito.set(carrito);
          this.sucursales.set(filtros.sucursales);
          this.sucursalId.set(filtros.sucursales[0]?.id ?? null);
        },
        error: (error: HttpErrorResponse) => this.error.set(this.obtenerMensajeError(error)),
      });
  }

  private toNumber(value: number | string | null | undefined): number {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private obtenerMensajeError(error: HttpErrorResponse): string {
    if (typeof error.error === 'object' && error.error !== null && 'detail' in error.error) {
      const detail = error.error.detail;

      if (typeof detail === 'string') {
        return detail;
      }
    }

    return 'No se pudo procesar el carrito.';
  }
}
