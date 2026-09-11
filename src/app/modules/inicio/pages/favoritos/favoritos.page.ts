import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TiendaStateService, TiendaProductoItem } from '../../../../core/services/tienda-state.service';

@Component({
  imports: [RouterLink],
  selector: 'app-favoritos-page',
  styleUrl: './favoritos.page.css',
  templateUrl: './favoritos.page.html',
})
export class FavoritosPage {
  private readonly tiendaState = inject(TiendaStateService);

  protected readonly favoritos = this.tiendaState.favoritos;

  protected agregarAlCarrito(item: TiendaProductoItem): void {
    this.tiendaState.agregarAlCarrito(item);
  }

  protected quitarFavorito(item: TiendaProductoItem): void {
    this.tiendaState.alternarFavorito(item);
  }

  protected formatPrecio(precio: number): string {
    return precio > 0 ? `Bs ${precio.toFixed(2)}` : 'Precio pendiente';
  }
}
