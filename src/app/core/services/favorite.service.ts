import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly API_URL = `${environment.apiUrl}/user/favorites`;
  
  favorites = signal<Favorite[]>([]);

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.API_URL)
      .pipe(tap(favorites => this.favorites.set(favorites)));
  }

  addFavorite(productId: number, userId: number): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.API_URL}/${productId}`, null)
      .pipe(tap(() => this.getFavorites().subscribe()));
  }

  removeFavorite(productId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${productId}`)
      .pipe(tap(() => this.getFavorites().subscribe()));
  }

  isFavorite(productId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/check/${productId}`);
  }
}
