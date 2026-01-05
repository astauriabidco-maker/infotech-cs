import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  UserProfile, 
  UpdateProfileRequest, 
  ChangePasswordRequest,
  SellerStats 
} from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user`;

  /**
   * Récupérer mon profil
   */
  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  /**
   * Mettre à jour mon profil
   */
  updateProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/profile`, request);
  }

  /**
   * Changer mon mot de passe
   */
  changePassword(request: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/password`, request);
  }

  /**
   * Supprimer mon compte
   */
  deleteAccount(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/account`);
  }

  /**
   * Récupérer mes statistiques (vendeur)
   */
  getMyStats(): Observable<SellerStats> {
    return this.http.get<SellerStats>(`${this.apiUrl}/stats`);
  }
}
