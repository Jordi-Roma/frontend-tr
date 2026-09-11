import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../autenticacion/services/auth.service';

interface ProductCard {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: number;
  sizes: string[];
  colors: string[];
  tag: string;
}

@Component({
  imports: [RouterLink],
  selector: 'app-inicio-page',
  styleUrl: './inicio.page.css',
  templateUrl: './inicio.page.html',
})
export class InicioPage {
  private readonly authService = inject(AuthService);

  protected readonly usuario = this.authService.usuarioActual;
  protected readonly esAdmin = computed(() => this.authService.tieneRol('ADMINISTRADOR'));

  protected readonly products: ProductCard[] = [
    {
      name: 'Polera Basica Essential',
      category: 'Poleras',
      description: 'Corte regular, algodon suave y look limpio para uso diario.',
      price: 'Bs 85',
      stock: 24,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#151515', '#f5f5f2', '#7c8f5a'],
      tag: 'Nuevo',
    },
    {
      name: 'Oversize Urban Fit',
      category: 'Oversize',
      description: 'Silueta amplia, hombro caido y estilo juvenil.',
      price: 'Bs 110',
      stock: 12,
      sizes: ['M', 'L', 'XL'],
      colors: ['#111111', '#717171', '#dde5cf'],
      tag: 'Mas vendido',
    },
    {
      name: 'Camisa Relaxed',
      category: 'Camisas',
      description: 'Camisa ligera para combinar con polera basica o usar abierta.',
      price: 'Bs 145',
      stock: 8,
      sizes: ['S', 'M', 'L'],
      colors: ['#f5f5f2', '#7c8f5a', '#2a2a2a'],
      tag: 'Bajo stock',
    },
  ];

  protected readonly benefits = [
    { icon: 'pi pi-truck', title: 'Envios coordinados', detail: 'Entrega segun disponibilidad.' },
    { icon: 'pi pi-shield', title: 'Compra segura', detail: 'Tus datos se mantienen protegidos.' },
    { icon: 'pi pi-refresh', title: 'Cambios faciles', detail: 'Gestion de cambios desde tu cuenta.' },
  ];
}
