import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { CategoriaResponse } from '../../models/catalogo.models';
import { CatalogoService } from '../../services/catalogo.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-categorias-page',
  styleUrl: './categorias.page.css',
  templateUrl: './categorias.page.html',
})
export class CategoriasPage {
  private readonly catalogoService = inject(CatalogoService);

  protected readonly categorias = signal<CategoriaResponse[]>([]);
  protected readonly busqueda = signal('');
  protected readonly filtroEstado = signal<'todos' | 'activos' | 'inactivos'>('todos');
  protected readonly cargando = signal(false);
  protected readonly procesando = signal(false);
  protected readonly categoriaEditandoId = signal<number | null>(null);
  protected readonly mensaje = signal('');
  protected readonly error = signal('');

  protected readonly categoriasFiltradas = computed(() => {
    const busqueda = this.busqueda().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.categorias().filter((categoria) => {
      const coincideBusqueda =
        busqueda === '' ||
        [categoria.nombre, categoria.descripcion ?? '']
          .join(' ')
          .toLowerCase()
          .includes(busqueda);

      const coincideEstado =
        estado === 'todos' ||
        (estado === 'activos' && categoria.activo) ||
        (estado === 'inactivos' && !categoria.activo);

      return coincideBusqueda && coincideEstado;
    });
  });

  protected readonly categoriaForm = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    descripcion: new FormControl<string | null>(null),
  });

  constructor() {
    this.cargarCategorias();
  }

  protected actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  protected actualizarFiltroEstado(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtroEstado.set(select.value as 'todos' | 'activos' | 'inactivos');
  }

  protected seleccionarCategoria(categoria: CategoriaResponse): void {
    this.categoriaEditandoId.set(categoria.id);
    this.categoriaForm.setValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    });
    this.limpiarMensajes();
  }

  protected cancelarEdicion(): void {
    this.categoriaEditandoId.set(null);
    this.categoriaForm.reset();
  }

  protected guardarCategoria(): void {
    this.limpiarMensajes();

    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    const { nombre, descripcion } = this.categoriaForm.getRawValue();
    this.procesando.set(true);
    const categoriaId = this.categoriaEditandoId();

    const operacion =
      categoriaId === null
        ? this.catalogoService.crearCategoria({
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() || null,
          })
        : this.catalogoService.actualizarCategoria(categoriaId, {
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() || null,
          });

    operacion.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: () => {
        this.mensaje.set(
          categoriaId === null
            ? 'Categoría creada correctamente.'
            : 'Categoría actualizada correctamente.'
        );
        this.cancelarEdicion();
        this.cargarCategorias();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  protected cambiarEstadoCategoria(categoria: CategoriaResponse): void {
    this.limpiarMensajes();
    this.procesando.set(true);
    const esActivo = categoria.activo;

    const operacion$: Observable<unknown> = esActivo
      ? this.catalogoService.desactivarCategoria(categoria.id)
      : this.catalogoService.activarCategoria(categoria.id);

    operacion$.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: () => {
        this.mensaje.set(
          esActivo
            ? 'Categoría desactivada correctamente.'
            : 'Categoría activada correctamente.'
        );
        this.cargarCategorias();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  private cargarCategorias(): void {
    this.cargando.set(true);
    this.error.set('');

    this.catalogoService
      .listarCategorias()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (categorias) => {
          this.categorias.set(categorias);
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
