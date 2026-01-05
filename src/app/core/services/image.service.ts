/**
 * Service pour l'upload et la gestion des images sur Cloudinary
 * Utilise les endpoints /api/images
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductImage, UploadImageResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/images`;

  /**
   * Upload une seule image pour un produit
   * Format accepté: JPG, PNG, WebP, GIF (max 10MB)
   */
  uploadProductImage(productId: number, file: File, altText?: string): Observable<UploadImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('altText', altText);
    }

    return this.http.post<UploadImageResponse>(
      `${this.apiUrl}/product/${productId}/upload`,
      formData
    );
  }

  /**
   * Upload plusieurs images pour un produit
   */
  uploadMultipleProductImages(
    productId: number, 
    files: File[], 
    altText?: string
  ): Observable<{ productId: number; images: ProductImage[]; total: number }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    if (altText) {
      formData.append('altText', altText);
    }

    return this.http.post<{ productId: number; images: ProductImage[]; total: number }>(
      `${this.apiUrl}/product/${productId}/upload/multiple`,
      formData
    );
  }

  /**
   * Récupère toutes les images d'un produit
   */
  getProductImages(productId: number): Observable<{ productId: number; images: ProductImage[]; total: number }> {
    return this.http.get<{ productId: number; images: ProductImage[]; total: number }>(
      `${this.apiUrl}/product/${productId}`
    );
  }

  /**
   * Supprime une image
   */
  deleteImage(imageId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${imageId}`);
  }

  /**
   * Supprime toutes les images d'un produit
   */
  deleteAllProductImages(productId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/product/${productId}/all`);
  }
}
