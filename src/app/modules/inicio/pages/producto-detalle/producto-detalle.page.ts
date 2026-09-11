import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { TiendaStateService } from '../../../../core/services/tienda-state.service';
import {
  CatalogoDisponibilidad,
  CatalogoPrendaDetalle,
  CatalogoVariante,
} from '../../models/catalogo-publico.models';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoPublicoService } from '../../services/catalogo-publico.service';

@Component({
  imports: [RouterLink],
  selector: 'app-producto-detalle-page',
  styleUrl: './producto-detalle.page.css',
  templateUrl: './producto-detalle.page.html',
})
export class ProductoDetallePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogoService = inject(CatalogoPublicoService);
  private readonly carritoService = inject(CarritoService);
  private readonly tiendaState = inject(TiendaStateService);

  protected readonly producto = signal<CatalogoPrendaDetalle | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly accionError = signal('');
  protected readonly cantidad = signal(1);
  protected readonly tallaId = signal<number | null>(null);
  protected readonly colorId = signal<number | null>(null);
  protected readonly sucursalId = signal<number | null>(null);
  protected readonly guardando = signal(false);
  protected readonly mensaje = signal('');

  protected readonly variantesFiltradas = computed(() => {
    const producto = this.producto();

    if (producto === null) {
      return [];
    }

    return producto.variantes.filter((variante) => {
      const coincideTalla = this.tallaId() === null || variante.talla_id === this.tallaId();
      const coincideColor = this.colorId() === null || variante.color_id === this.colorId();
      return coincideTalla && coincideColor;
    });
  });

  protected readonly disponibilidadFiltrada = computed(() => {
    const producto = this.producto();

    if (producto === null) {
      return [];
    }

    return producto.disponibilidad.filter((item) => {
      const coincideTalla = this.tallaId() === null || item.talla_id === this.tallaId();
      const coincideColor = this.colorId() === null || item.color_id === this.colorId();
      return coincideTalla && coincideColor;
    });
  });

  protected readonly precio = computed(() => {
    const variantes = this.variantesFiltradas();
    const precios = variantes
      .map((variante) => this.toNumber(variante.precio_final ?? variante.precio_vigente))
      .filter((precio) => precio > 0);

    if (precios.length > 0) {
      return Math.min(...precios);
    }

    const producto = this.producto();
    return this.toNumber(producto?.precio_final ?? producto?.precio_vigente);
  });

  protected readonly stockSeleccionado = computed(() =>
    this.disponibilidadFiltrada().reduce(
      (total, item) => total + Math.max(item.stock_disponible - item.stock_reservado, 0),
      0
    )
  );

  protected readonly varianteSeleccionada = computed(() => {
    const variantes = this.variantesFiltradas();
    return variantes.length === 1 ? variantes[0] : null;
  });

  protected readonly sucursalesDisponibles = computed(() => {
    const map = new Map<number, CatalogoDisponibilidad>();

    this.disponibilidadFiltrada()
      .filter((item) => item.disponible)
      .forEach((item) => map.set(item.sucursal_id, item));

    return Array.from(map.values());
  });

  ngOnInit(): void {
    const productoId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(productoId)) {
      this.error.set('Producto no valido.');
      return;
    }

    this.cargarProducto(productoId);
  }

  protected seleccionarTalla(id: number | null): void {
    this.tallaId.set(id);
  }

  protected seleccionarColor(id: number | null): void {
    this.colorId.set(id);
  }

  protected seleccionarSucursal(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sucursalId.set(value === '' ? null : Number(value));
  }

  protected cambiarCantidad(delta: number): void {
    this.cantidad.update((value) => Math.max(1, value + delta));
  }

  protected agregarAlCarrito(): void {
    const variante = this.varianteSeleccionada();
    const sucursalId = this.sucursalId();

    if (variante === null) {
      this.accionError.set('Selecciona una talla y color especificos antes de agregar al carrito.');
      return;
    }

    if (sucursalId === null) {
      this.accionError.set('Selecciona una sucursal con disponibilidad.');
      return;
    }

    this.guardando.set(true);
    this.accionError.set('');
    this.mensaje.set('');

    this.carritoService
      .agregarItem({
        producto_variante_id: variante.id,
        sucursal_id: sucursalId,
        cantidad: this.cantidad(),
      })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => {
          const producto = this.producto();
          if (producto !== null) {
            for (let index = 0; index < this.cantidad(); index += 1) {
              this.tiendaState.agregarAlCarrito({
                id: producto.producto_id,
                nombre: producto.nombre,
                categoria: producto.categoria,
                precio: this.precio(),
              });
            }
          }
          this.mensaje.set('Producto agregado al carrito.');
        },
        error: (error: HttpErrorResponse) => {
          this.accionError.set(this.obtenerMensajeError(error));
        },
      });
  }

  protected alternarFavorito(): void {
    const producto = this.producto();

    if (producto === null) {
      return;
    }

    this.tiendaState.alternarFavorito({
      id: producto.producto_id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: this.precio(),
    });
  }

  protected esFavorito(): boolean {
    const producto = this.producto();
    return producto !== null && this.tiendaState.esFavorito(producto.producto_id);
  }

  protected formatPrecio(precio: number | string | null | undefined): string {
    const value = this.toNumber(precio);
    return value > 0 ? `Bs ${value.toFixed(2)}` : 'Precio pendiente';
  }

  protected inicialesCategoria(item: CatalogoPrendaDetalle): string {
    return (item.categoria || 'ST').slice(0, 2).toUpperCase();
  }

  protected varianteLabel(variante: CatalogoVariante): string {
    return [variante.talla, variante.color].filter(Boolean).join(' / ') || variante.sku;
  }

  protected disponibilidadLabel(item: CatalogoDisponibilidad): string {
    const variante = [item.talla, item.color].filter(Boolean).join(' / ');
    return variante ? `${item.ciudad} - ${item.sucursal} (${variante})` : `${item.ciudad} - ${item.sucursal}`;
  }

  private cargarProducto(productoId: number): void {
    this.cargando.set(true);
    this.error.set('');

    this.catalogoService
      .obtenerPrenda(productoId)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (producto) => {
          this.producto.set(producto);
          const primeraDisponibilidad = producto.disponibilidad.find((item) => item.disponible);
          this.tallaId.set(primeraDisponibilidad?.talla_id ?? producto.tallas[0]?.id ?? null);
          this.colorId.set(primeraDisponibilidad?.color_id ?? producto.colores[0]?.id ?? null);
          this.sucursalId.set(primeraDisponibilidad?.sucursal_id ?? null);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.obtenerMensajeError(error));
        },
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

    return 'No se pudo cargar el producto.';
  }
}
