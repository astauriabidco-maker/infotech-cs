/**
 * Service pour la gestion des produits
 * Utilise les endpoints /api/admin/products (admin) et /api/seller/products (vendeurs)
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {
  private readonly http = inject(HttpClient);
  private readonly adminApiUrl = `${environment.apiUrl}/admin/products`;
  private readonly sellerApiUrl = `${environment.apiUrl}/seller/products`;

  /**
   * Créer un nouveau produit
   * Utilise automatiquement le bon endpoint selon le rôle de l'utilisateur
   */
  createProduct(request: CreateProductRequest): Observable<Product> {
    // Pour les vendeurs, utiliser l'endpoint seller
    return this.http.post<Product>(this.sellerApiUrl, request);
  }

  /**
   * [ADMIN ONLY] Créer un produit en tant qu'admin
   */
  createProductAsAdmin(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.adminApiUrl, request);
  }
}
