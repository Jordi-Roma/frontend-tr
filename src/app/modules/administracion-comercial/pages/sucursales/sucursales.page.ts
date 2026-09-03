import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import {
  CiudadResponse,
  SucursalResponse,
} from '../../models/ciudad-sucursal.models';
import { CiudadSucursalService } from '../../services/ciudad-sucursal.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-sucursales-page',
  styleUrl: './sucursales.page.css',
  templateUrl: './sucursales.page.html',
})
export class SucursalesPage {
  private readonly ciudadSucursalService = inject(CiudadSucursalService);

  protected readonly sucursales = signal<SucursalResponse[]>([]);
  protected readonly ciudades = signal<CiudadResponse[]>([]);
  protected readonly busqueda = signal('');
  protected readonly cargando = signal(false);
  protected readonly procesando = signal(false);
  protected readonly sucursalEditandoId = signal<number | null>(null);
  protected readonly mensaje = signal('');
  protected readonly error = signal('');

  protected readonly sucursalesFiltradas = computed(() => {
    const busqueda = this.busqueda().trim().toLowerCase();

    if (busqueda === '') {
      return this.sucursales();
    }

    return this.sucursales().filter((sucursal) => {
      const texto = [
        sucursal.nombre,
        sucursal.direccion,
        sucursal.telefono ?? '',
        sucursal.ciudad_nombre,
      ]
        .join(' ')
        .toLowerCase();

      return texto.includes(busqueda);
    });
  });

  protected readonly sucursalForm = new FormGroup({
    ciudadId: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    direccion: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    telefono: new FormControl<string | null>(null),
  });

  constructor() {
    this.cargarDatos();
  }

  protected actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  protected seleccionarSucursal(sucursal: SucursalResponse): void {
    this.sucursalEditandoId.set(sucursal.id);
    this.sucursalForm.setValue({
      ciudadId: sucursal.ciudad_id,
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      telefono: sucursal.telefono,
    });
    this.limpiarMensajes();
  }

  protected cancelarEdicion(): void {
    this.sucursalEditandoId.set(null);
    this.sucursalForm.reset();
  }

  protected guardarSucursal(): void {
    this.limpiarMensajes();

    if (this.sucursalForm.invalid) {
      this.sucursalForm.markAllAsTouched();
      return;
    }

    const { ciudadId, nombre, direccion, telefono } =
      this.sucursalForm.getRawValue();

    if (ciudadId === null) {
      this.error.set('La ciudad es obligatoria.');
      return;
    }

    this.procesando.set(true);
    const request = {
      ciudad_id: ciudadId,
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      telefono: this.limpiarTextoOpcional(telefono),
    };
    const sucursalId = this.sucursalEditandoId();
    const operacion =
      sucursalId === null
        ? this.ciudadSucursalService.crearSucursal(request)
        : this.ciudadSucursalService.actualizarSucursal(sucursalId, request);

    operacion.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: () => {
        this.mensaje.set(
          sucursalId === null
            ? 'Sucursal creada correctamente.'
            : 'Sucursal actualizada correctamente.'
        );
        this.cancelarEdicion();
        this.cargarSucursales();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  protected cambiarEstadoSucursal(sucursal: SucursalResponse): void {
    this.limpiarMensajes();
    this.procesando.set(true);
    const operacion = sucursal.activo
      ? this.ciudadSucursalService.desactivarSucursal(sucursal.id)
      : this.ciudadSucursalService.activarSucursal(sucursal.id);

    operacion.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: (response) => {
        this.mensaje.set(response.mensaje);
        this.cargarSucursales();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  private cargarDatos(): void {
    this.cargarSucursales();
    this.ciudadSucursalService.listarCiudades().subscribe({
      next: (ciudades) => {
        this.ciudades.set(ciudades);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  private cargarSucursales(): void {
    this.cargando.set(true);
    this.error.set('');

    this.ciudadSucursalService
      .listarSucursales()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (sucursales) => {
          this.sucursales.set(sucursales);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.obtenerMensajeError(error));
        },
      });
  }

  private limpiarMensajes(): void {
    this.mensaje.set('');
    this.error.set('');
  }

  private limpiarTextoOpcional(valor: string | null): string | null {
    if (valor === null) {
      return null;
    }

    const limpio = valor.trim();
    return limpio === '' ? null : limpio;
  }

  private obtenerMensajeError(error: HttpErrorResponse): string {
    const detail = this.obtenerDetail(error.error);

    if (detail !== '') {
      return detail;
    }

    return 'No se pudo completar la operación. Intenta nuevamente.';
  }

  private obtenerDetail(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'detail' in error &&
      typeof error.detail === 'string'
    ) {
      return error.detail;
    }

    return '';
  }
}
