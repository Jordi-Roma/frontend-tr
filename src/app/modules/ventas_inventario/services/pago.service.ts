import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import {
  CheckoutStripeResponse,
  ConfirmarPagoPruebaRequest,
  CrearCheckoutStripeRequest,
  OrdenPagoResponse,
} from '../models/pago.models';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/api/v1/pagos`;

  crearCheckoutStripe(request: CrearCheckoutStripeRequest): Observable<CheckoutStripeResponse> {
    return this.http.post<CheckoutStripeResponse>(`${this.apiUrl}/stripe/checkout`, request);
  }

  obtenerOrden(ordenId: number): Observable<OrdenPagoResponse> {
    return this.http.get<OrdenPagoResponse>(`${this.apiUrl}/orden/${ordenId}`);
  }

  confirmarPrueba(ordenId: number, request: ConfirmarPagoPruebaRequest): Observable<OrdenPagoResponse> {
    return this.http.post<OrdenPagoResponse>(`${this.apiUrl}/stripe/confirmar-prueba/${ordenId}`, request);
  }
}
