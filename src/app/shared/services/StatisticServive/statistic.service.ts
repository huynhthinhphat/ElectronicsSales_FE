import { Injectable } from '@angular/core';
import { Response as ApiResponse } from '../../../models/Response.model';
import { DailySummary } from '../../../models/DailySummary.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomList } from '../../../models/CustomList.model';
import { Product } from '../../../models/Product.model';
import { DailyRevenue } from '../../../models/DailyRevenue.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private BASE_URL = environment.apiUrl + '/api/statistics';

  constructor(private http: HttpClient) { }

  getDailySummary(): Observable<ApiResponse<DailySummary>> {
    return this.http.get<ApiResponse<DailySummary>>(`${this.BASE_URL}`, { withCredentials: true });
  }

  getTopProducts(limit: number, startDay: string, endDay: string) {
    return this.http.get<ApiResponse<CustomList<Product>>>(`${this.BASE_URL}/top-products?limit=${limit}&startDay=${startDay}&endDay=${endDay}`, { withCredentials: true });
  }

  getDailyRevenue(limit: number, startDay: string, endDay: string) {
    return this.http.get<ApiResponse<CustomList<DailyRevenue>>>(`${this.BASE_URL}/revenue?limit=${limit}&startDay=${startDay}&endDay=${endDay}`, { withCredentials: true });
  }
}
