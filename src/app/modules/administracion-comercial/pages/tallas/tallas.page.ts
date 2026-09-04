import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { TallaResponse } from '../../models/catalogo.models';
import { CatalogoService } from '../../services/catalogo.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-tallas-page',
  styleUrl: './tallas.page.css',
  templateUrl: './tallas.page.html',
})
export class TallasPage {
  private readonly catalogoService = inject(CatalogoService);

  protected readonly tallas = signal<TallaResponse[]>([]);
  protected readonly busqueda = signal('');
  protected readonly filtroEstado = signal<'todos' | 'activos' | 'inactivos'>('todos');
  protected readonly cargando = signal(false);
  protected readonly procesando = signal(false);
  protected readonly tallaEditandoId = signal<number | null>(null);
  protected readonly mensaje = signal('');
  protected readonly error = signal('');

  protected readonly tallasFiltradas = computed(() => {
    const busqueda = this.busqueda().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.tallas().filter((talla) => {
      const coincideBusqueda =
        busqueda === '' ||
        [talla.nombre, talla.descripcion ?? '']
          .join(' ')
          .toLowerCase()
          .includes(busqueda);

      const coincideEstado =
        estado === 'todos' ||
        (estado === 'activos' && talla.activo) ||
        (estado === 'inactivos' && !talla.activo);

      return coincideBusqueda && coincideEstado;
    });
  });

  protected readonly tallaForm = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    descripcion: new FormControl<string | null>(null),
  });

  constructor() {
    this.cargarTallas();
  }

  protected actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  protected actualizarFiltroEstado(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtroEstado.set(select.value as 'todos' | 'activos' | 'inactivos');
  }

  protected seleccionarTalla(talla: TallaResponse): void {
    this.tallaEditandoId.set(talla.id);
    this.tallaForm.setValue({
      nombre: talla.nombre,
      descripcion: talla.descripcion,
    });
    this.limpiarMensajes();
  }

  protected cancelarEdicion(): void {
    this.tallaEditandoId.set(null);
    this.tallaForm.reset();
  }

  protected guardarTalla(): void {
    this.limpiarMensajes();

    if (this.tallaForm.invalid) {
      this.tallaForm.markAllAsTouched();
      return;
    }

    const { nombre, descripcion } = this.tallaForm.getRawValue();
    this.procesando.set(true);
    const tallaId = this.tallaEditandoId();

    const operacion =
      tallaId === null
        ? this.catalogoService.crearTalla({
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() || null,
          })
        : this.catalogoService.actualizarTalla(tallaId, {
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() || null,
          });

    operacion.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: () => {
        this.mensaje.set(
          tallaId === null
            ? 'Talla creada correctamente.'
            : 'Talla actualizada correctamente.'
        );
        this.cancelarEdicion();
        this.cargarTallas();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  protected cambiarEstadoTalla(talla: TallaResponse): void {
    this.limpiarMensajes();
    this.procesando.set(true);
    const esActivo = talla.activo;

    const operacion$: Observable<unknown> = esActivo
      ? this.catalogoService.desactivarTalla(talla.id)
      : this.catalogoService.activarTalla(talla.id);

    operacion$.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: () => {
        this.mensaje.set(
          esActivo
            ? 'Talla desactivada correctamente.'
            : 'Talla activada correctamente.'
        );
        this.cargarTallas();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  private cargarTallas(): void {
    this.cargando.set(true);
    this.error.set('');

    this.catalogoService
      .listarTallas()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (tallas) => {
          this.tallas.set(tallas);
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

  private obtenerMensajeError(error: HttpErrorResponse): string {
    const detail = this.obtenerDetail(error.error);
    return detail !== '' ? detail : 'No se pudo completar la operación. Intenta nuevamente.';
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
