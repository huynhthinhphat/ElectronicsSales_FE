import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../../../models/Review.model';
import { Observable } from 'rxjs';
import { Response as ApiResponse } from '../../../models/Response.model';
import { CustomPage } from '../../../models/CustomPage.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private BASE_URL = environment.apiUrl + '/api/reviews';

  constructor(
    private http: HttpClient
  ) { }

  viewReviewOfUser(id: string): Observable<ApiResponse<Review>> {
    return this.http.get<ApiResponse<Review>>(`${this.BASE_URL}/user/detail?id=${id}`, { withCredentials: true });
  }

  viewReviewOfAdmin(id: string): Observable<ApiResponse<Review>> {
    return this.http.get<ApiResponse<Review>>(`${this.BASE_URL}/admin/detail?id=${id}`, { withCredentials: true });
  }

  createReview(review: Review): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}`, review, { withCredentials: true });
  }

  viewReviewsOfUser(id: string, orderBy: string): Observable<ApiResponse<CustomPage<Review>>> {
    return this.http.get<ApiResponse<CustomPage<Review>>>(`${this.BASE_URL}?id=${id}&orderBy=${orderBy}`, { withCredentials: true });
  }

  viewReviewsOfAdmin(search: string, page: number, limit: number, star: string): Observable<ApiResponse<CustomPage<Review>>> {
    return this.http.get<ApiResponse<CustomPage<Review>>>(`${this.BASE_URL}/list?search=${search}&page=${page}&limit=${limit}&star=${star}`, { withCredentials: true });
  }
}
