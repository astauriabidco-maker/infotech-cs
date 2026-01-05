import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile, UserStats } from '../models/user-profile.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/users`;

  /**
   * Lister tous les utilisateurs avec pagination
   */
  getAllUsers(page: number = 0, size: number = 20, search?: string): Observable<Page<UserProfile>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Page<UserProfile>>(this.apiUrl, { params });
  }

  /**
   * Récupérer un utilisateur par ID
   */
  getUserById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`);
  }

  /**
   * Ajouter un rôle à un utilisateur
   */
  addRole(userId: number, role: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/${userId}/roles/${role}`, {});
  }

  /**
   * Retirer un rôle à un utilisateur
   */
  removeRole(userId: number, role: string): Observable<UserProfile> {
    return this.http.delete<UserProfile>(`${this.apiUrl}/${userId}/roles/${role}`);
  }

  /**
   * Désactiver un compte
   */
  disableUser(userId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${userId}/disable`, {});
  }

  /**
   * Réactiver un compte
   */
  enableUser(userId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${userId}/enable`, {});
  }

  /**
   * Supprimer un utilisateur
   */
  deleteUser(userId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Statistiques globales des utilisateurs
   */
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/stats`);
  }

  /**
   * Lister tous les vendeurs
   */
  getAllSellers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/sellers`);
  }

  /**
   * Lister tous les admins
   */
  getAllAdmins(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/admins`);
  }
}
