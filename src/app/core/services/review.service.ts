import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, ReviewStats } from '../models/review.model';
import { Page } from '../models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly API_URL = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getProductReviews(productId: number, page: number = 0, size: number = 10): Observable<Page<Review>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Review>>(`${this.API_URL}/product/${productId}`, { params });
  }

  getProductReviewStats(productId: number): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.API_URL}/product/${productId}/stats`);
  }

  createReview(review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(this.API_URL, review);
  }

  deleteReview(reviewId: number, userId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.delete<void>(`${this.API_URL}/${reviewId}`, { params });
  }
}
