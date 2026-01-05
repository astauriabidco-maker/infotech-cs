import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Listing, CreateListingRequest } from '../models/listing.model';
import { Page } from '../models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private readonly API_URL = `${environment.apiUrl}/listings`;
  private readonly ADMIN_API_URL = `${environment.apiUrl}/admin/listings`;
  private readonly SELLER_API_URL = `${environment.apiUrl}/seller/listings`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer les listings publics (avec pagination)
   */
  getListings(page: number = 0, size: number = 12, search?: string): Observable<Page<Listing>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Page<Listing>>(this.API_URL, { params });
  }

  /**
   * Récupérer un listing par son ID
   */
  getListing(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.API_URL}/${id}`);
  }

  /**
   * Récupérer tous les listings actifs d'un produit
   * L'API retourne une Page paginée, on filtre ensuite par productId
   */
  getListingsByProduct(productId: number): Observable<Listing[]> {
    // L'endpoint /api/listings retourne une Page<Listing>, pas un tableau
    return this.http.get<Page<Listing>>(this.API_URL).pipe(
      map(page => {
        // On extrait le tableau de listings de la page
        const allListings = page.content;
        // On filtre pour ne garder que ceux du produit demandé et actifs
        const filtered = allListings.filter(l => l.productId === productId && l.active);
        console.log(`📦 Listings filtrés pour produit ${productId}:`, filtered);
        return filtered;
      })
    );
  }

  /**
   * Récupérer mes listings (vendeur connecté)
   */
  getMyListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.SELLER_API_URL);
  }

  /**
   * Créer un nouveau listing (vendeur)
   */
  createListing(request: CreateListingRequest): Observable<Listing> {
    return this.http.post<Listing>(this.SELLER_API_URL, request);
  }

  /**
   * Supprimer mon listing (vendeur)
   */
  deleteListing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.SELLER_API_URL}/${id}`);
  }

  /**
   * [ADMIN ONLY] Récupérer tous les listings
   */
  getAllListingsAsAdmin(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.ADMIN_API_URL);
  }

  /**
   * [ADMIN ONLY] Créer un listing en tant qu'admin
   */
  createListingAsAdmin(request: CreateListingRequest): Observable<Listing> {
    return this.http.post<Listing>(this.ADMIN_API_URL, request);
  }

  /**
   * [ADMIN ONLY] Supprimer n'importe quel listing
   */
  deleteListingAsAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ADMIN_API_URL}/${id}`);
  }
}
