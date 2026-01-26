import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = `${environment.apiUrl}/user/orders`;

  constructor(private http: HttpClient) {}

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.API_URL, request);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${id}`);
  }

  cancelOrder(id: number): Observable<Order> {
    return this.http.post<Order>(`${this.API_URL}/${id}/cancel`, null);
  }

  /**
   * Récupère les commandes contenant les produits du vendeur
   * @param search - Filtre optionnel par numéro de commande
   */
  getSellerOrders(search?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Order[]>(`${environment.apiUrl}/seller/orders`, { params });
  }

  /**
   * Récupère toutes les commandes de la plateforme (admin uniquement)
   * @param search - Filtre optionnel par numéro de commande
   * @param status - Filtre optionnel par statut
   */
  getAdminOrders(search?: string, status?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Order[]>(`${environment.apiUrl}/admin/orders`, { params });
  }

  /**
   * Met à jour le statut d'une commande (vendeur uniquement)
   * @param orderId - ID de la commande
   * @param status - Nouveau statut (SHIPPED, COMPLETED, etc.)
   */
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${environment.apiUrl}/seller/orders/${orderId}/status`, { status });
  }
}
