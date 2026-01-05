import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductFilters } from '../models/product.model';
import { Page } from '../models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters = {}): Observable<Page<Product>> {
    let params = new HttpParams();
    
    if (filters.search) params = params.set('search', filters.search);
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId.toString());
    if (filters.brand) params = params.set('brand', filters.brand);
    if (filters.condition) params = params.set('condition', filters.condition);
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.page !== undefined) params = params.set('page', filters.page.toString());
    if (filters.size) params = params.set('size', filters.size.toString());
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<Page<Product>>(this.API_URL, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/brands`);
  }

  getConditions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/conditions`);
  }

  searchProducts(query: string, page: number = 0, size: number = 12): Observable<Page<Product>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Product>>(`${this.API_URL}/search`, { params });
  }
}
