import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CartItem, CartSummary } from '../models/cart.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = `${environment.apiUrl}/user/cart`;

  private cartItems = signal<CartItem[]>([]);
  
  cartSummary = computed<CartSummary>(() => {
    const items = this.cartItems();
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      items,
      subtotal,
      total: subtotal, // Peut être modifié pour inclure taxes, frais de port, etc.
      itemCount
    };
  });

  constructor(private http: HttpClient) {}

  loadCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.API_URL)
      .pipe(tap(items => this.cartItems.set(items)));
  }

  addToCart(userId: number, item: Partial<CartItem>): Observable<CartItem> {
    return this.http.post<CartItem>(this.API_URL, item)
      .pipe(tap(() => this.loadCart().subscribe()));
  }

  updateQuantity(cartItemId: number, quantity: number): Observable<CartItem> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.http.put<CartItem>(`${this.API_URL}/${cartItemId}/quantity`, null, { params })
      .pipe(tap(() => this.loadCart().subscribe()));
  }

  removeFromCart(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${cartItemId}`)
      .pipe(tap(() => this.loadCart().subscribe()));
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.API_URL)
      .pipe(tap(() => this.cartItems.set([])));
  }

  getCartItems() {
    return this.cartItems();
  }
}
