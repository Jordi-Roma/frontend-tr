import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { ProductoResponse, ImagenProductoRequest } from '../../models/producto.models';
import { ProductoService } from '../../services/producto.service';
import { CatalogoService } from '../../services/catalogo.service';
import { ProveedorService } from '../../services/proveedor.service';
import { ColeccionService } from '../../services/coleccion.service';
import {
  CategoriaResponse,
  MarcaResponse,
} from '../../models/catalogo.models';
import { ProveedorResponse } from '../../models/proveedor.models';
import { ColeccionResponse } from '../../models/catalogo.models';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-productos-page',
  styleUrl: './productos.page.css',
  templateUrl: './productos.page.html',
})
export class ProductosPage implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly proveedorService = inject(ProveedorService);
  private readonly coleccionService = inject(ColeccionService);

  protected readonly productos = signal<ProductoResponse[]>([]);
  protected readonly categorias = signal<CategoriaResponse[]>([]);
  protected readonly marcas = signal<MarcaResponse[]>([]);
  protected readonly proveedores = signal<ProveedorResponse[]>([]);
  protected readonly colecciones = signal<ColeccionResponse[]>([]);

  protected readonly busqueda = signal('');
  protected readonly filtroEstado = signal<'todos' | 'activos' | 'inactivos'>('todos');
  protected readonly cargando = signal(false);
  protected readonly procesando = signal(false);
  protected readonly productoEditandoId = signal<number | null>(null);
  protected readonly mensaje = signal('');
  protected readonly error = signal('');

  // Gestion de imagenes en memoria
  protected readonly imagenesEditando = signal<ImagenProductoRequest[]>([]);

  protected readonly productosFiltrados = computed(() => {
    const busqueda = this.busqueda().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.productos().filter((producto) => {
      const coincideBusqueda =
        busqueda === '' ||
        [producto.nombre, producto.descripcion ?? '', producto.categoria_nombre, producto.marca_nombre ?? '']
          .join(' ')
          .toLowerCase()
          .includes(busqueda);

      const coincideEstado =
        estado === 'todos' ||
        (estado === 'activos' && producto.activo) ||
        (estado === 'inactivos' && !producto.activo);

      return coincideBusqueda && coincideEstado;
    });
  });

  protected readonly productoForm = new FormGroup({
    categoria_id: new FormControl<number | null>(null, [Validators.required]),
    marca_id: new FormControl<number | null>(null),
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    descripcion: new FormControl<string | null>(null),
    material: new FormControl<string | null>(null),
    genero: new FormControl<string | null>(null),
    colecciones_ids: new FormControl<number[]>([]),
    proveedores_ids: new FormControl<number[]>([]),
    // url input for appending new images
    url_imagen_nueva: new FormControl<string | null>(null)
  });

  ngOnInit() {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.catalogoService.listarCategorias().subscribe(data => this.categorias.set(data.filter(c => c.activo)));
    this.catalogoService.listarMarcas().subscribe(data => this.marcas.set(data.filter(c => c.activo)));
    this.proveedorService.listarProveedores().subscribe(data => this.proveedores.set(data.filter(c => c.activo)));
    this.coleccionService.listarColecciones().subscribe(data => this.colecciones.set(data.filter(c => c.activo)));

    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.cargando.set(true);
    this.productoService
      .listarProductos()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (productos) => {
          this.productos.set(productos);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.obtenerMensajeError(error));
        },
      });
  }

  protected actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  protected actualizarFiltroEstado(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtroEstado.set(select.value as 'todos' | 'activos' | 'inactivos');
  }

  // Interacción multi-select simple (Angular Forms no maneja <select multiple> perfectamente sin directivas de 3ros a veces, 
  // pero usaremos el manejo manual si es necesario, o el binding directo de select multiple)
  
  protected seleccionarProducto(producto: ProductoResponse): void {
    this.productoEditandoId.set(producto.id);
    this.productoForm.reset();
    this.productoForm.patchValue({
      categoria_id: producto.categoria_id,
      marca_id: producto.marca_id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      material: producto.material,
      genero: producto.genero,
      colecciones_ids: producto.colecciones_ids,
      proveedores_ids: producto.proveedores_ids,
    });
    this.imagenesEditando.set(
      producto.imagenes.map(img => ({ url: img.url, es_principal: img.es_principal }))
    );
    this.limpiarMensajes();
  }

  protected cancelarEdicion(): void {
    this.productoEditandoId.set(null);
    this.productoForm.reset();
    this.imagenesEditando.set([]);
  }

  protected agregarImagen(): void {
    const urlControl = this.productoForm.get('url_imagen_nueva');
    const url = urlControl?.value?.trim();
    if (url) {
      this.imagenesEditando.update(imgs => [
        ...imgs,
        { url, es_principal: imgs.length === 0 } // La primera es principal por defecto
      ]);
      urlControl?.setValue('');
    }
  }

  protected quitarImagen(index: number): void {
    this.imagenesEditando.update(imgs => {
      const copy = [...imgs];
      const removida = copy.splice(index, 1)[0];
      // Si se remueve la principal y quedan más, la primera se vuelve principal
      if (removida.es_principal && copy.length > 0) {
        copy[0].es_principal = true;
      }
      return copy;
    });
  }

  protected setPrincipal(index: number): void {
    this.imagenesEditando.update(imgs => {
      return imgs.map((img, i) => ({ ...img, es_principal: i === index }));
    });
  }

  // Handle Multi Select changes manually if needed
  protected onColeccionesChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const values = Array.from(select.selectedOptions).map(opt => parseInt(opt.value, 10));
    this.productoForm.patchValue({ colecciones_ids: values });
  }

  protected onProveedoresChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const values = Array.from(select.selectedOptions).map(opt => parseInt(opt.value, 10));
    this.productoForm.patchValue({ proveedores_ids: values });
  }


  protected guardarProducto(): void {
    this.limpiarMensajes();

    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const val = this.productoForm.getRawValue();
    if (!val.categoria_id) {
        this.error.set("Categoría obligatoria");
        return;
    }

    this.procesando.set(true);
    const productoId = this.productoEditandoId();
    
    const request = {
        categoria_id: val.categoria_id,
        marca_id: val.marca_id || null,
        nombre: val.nombre,
        descripcion: val.descripcion || null,
        material: val.material || null,
        genero: val.genero || null,
        colecciones_ids: val.colecciones_ids || [],
        proveedores_ids: val.proveedores_ids || [],
        imagenes: this.imagenesEditando()
    };

    const operacion =
      productoId === null
        ? this.productoService.crearProducto(request)
        : this.productoService.actualizarProducto(productoId, request);

    operacion.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: () => {
        this.mensaje.set(
          productoId === null
            ? 'Producto creado correctamente.'
            : 'Producto actualizado correctamente.'
        );
        this.cancelarEdicion();
        this.cargarProductos();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  protected cambiarEstadoProducto(producto: ProductoResponse): void {
    this.limpiarMensajes();
    this.procesando.set(true);
    const esActivo = producto.activo;

    const operacion$: Observable<unknown> = esActivo
      ? this.productoService.desactivarProducto(producto.id)
      : this.productoService.activarProducto(producto.id);

    operacion$.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: () => {
        this.mensaje.set(
          esActivo
            ? 'Producto desactivado correctamente.'
            : 'Producto activado correctamente.'
        );
        this.cargarProductos();
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
