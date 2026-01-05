/**
 * Service pour la gestion du profil vendeur
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SellerProfile, CreateSellerProfileRequest } from '../models/seller-profile.model';

@Injectable({
  providedIn: 'root'
})
export class SellerProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/seller/profile`;

  /**
   * Créer ou récupérer mon profil vendeur
   */
  createProfile(request: CreateSellerProfileRequest): Observable<SellerProfile> {
    return this.http.post<SellerProfile>(`${this.apiUrl}/create`, request);
  }

  /**
   * Récupérer mon profil vendeur
   */
  getMyProfile(): Observable<SellerProfile> {
    return this.http.get<SellerProfile>(`${this.apiUrl}/me`);
  }

  /**
   * Modifier mon profil vendeur
   */
  updateProfile(request: CreateSellerProfileRequest): Observable<SellerProfile> {
    return this.http.put<SellerProfile>(this.apiUrl, request);
  }

  /**
   * Supprimer mon profil vendeur
   */
  deleteProfile(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  /**
   * Vérifier si le profil vendeur existe
   * Retourne true si existe, false sinon
   */
  checkProfileExists(): Observable<boolean> {
    return new Observable(observer => {
      this.getMyProfile().subscribe({
        next: () => {
          observer.next(true);
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
