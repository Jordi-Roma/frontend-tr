import { Injectable, signal } from '@angular/core';

export interface TiendaProductoItem {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
}

export interface CarritoItem extends TiendaProductoItem {
  cantidad: number;
}

const CART_STORAGE_KEY = 'stylear_cart';
const FAVORITES_STORAGE_KEY = 'stylear_favorites';

@Injectable({
  providedIn: 'root',
})
export class TiendaStateService {
  private readonly carritoSignal = signal<CarritoItem[]>(this.leerCarrito());
  private readonly favoritosSignal = signal<TiendaProductoItem[]>(this.leerFavoritos());

  readonly carrito = this.carritoSignal.asReadonly();
  readonly favoritos = this.favoritosSignal.asReadonly();

  agregarAlCarrito(producto: TiendaProductoItem): void {
    this.carritoSignal.update((items) => {
      const existente = items.find((item) => item.id === producto.id);

      if (existente === undefined) {
        return this.persistirCarrito([...items, { ...producto, cantidad: 1 }]);
      }

      return this.persistirCarrito(
        items.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    });
  }

  cambiarCantidad(productoId: number, cantidad: number): void {
    const cantidadNormalizada = Math.max(1, cantidad);

    this.carritoSignal.update((items) =>
      this.persistirCarrito(
        items.map((item) =>
          item.id === productoId ? { ...item, cantidad: cantidadNormalizada } : item
        )
      )
    );
  }

  quitarDelCarrito(productoId: number): void {
    this.carritoSignal.update((items) =>
      this.persistirCarrito(items.filter((item) => item.id !== productoId))
    );
  }

  vaciarCarrito(): void {
    this.carritoSignal.set(this.persistirCarrito([]));
  }

  alternarFavorito(producto: TiendaProductoItem): void {
    this.favoritosSignal.update((items) => {
      const existe = items.some((item) => item.id === producto.id);
      const next = existe
        ? items.filter((item) => item.id !== producto.id)
        : [...items, producto];

      return this.persistirFavoritos(next);
    });
  }

  esFavorito(productoId: number): boolean {
    return this.favoritosSignal().some((item) => item.id === productoId);
  }

  private leerCarrito(): CarritoItem[] {
    return this.leerStorage<CarritoItem[]>(CART_STORAGE_KEY, []);
  }

  private leerFavoritos(): TiendaProductoItem[] {
    return this.leerStorage<TiendaProductoItem[]>(FAVORITES_STORAGE_KEY, []);
  }

  private leerStorage<T>(key: string, fallback: T): T {
    const value = localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      localStorage.removeItem(key);
      return fallback;
    }
  }

  private persistirCarrito(items: CarritoItem[]): CarritoItem[] {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    return items;
  }

  private persistirFavoritos(items: TiendaProductoItem[]): TiendaProductoItem[] {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
    return items;
  }
}
