import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response as ApiResponse } from '../../../models/Response.model';
import { Order } from '../../../models/Order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) { }

  private BASE_URL = 'http://localhost:8090/api/orders';

  createOrder(data: Order): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}`, data, { withCredentials: true });
  }

  updateOrder(order: Order): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.BASE_URL}`, order, { withCredentials: true });
  }

  viewOrders(search: string, page: number, limit: number, status: string, transaction: string, delivery: string, startDay?: string, endDay?: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}?search=${search}&page=${page}&limit=${limit}&status=${status}&transaction=${transaction}&delivery=${delivery}&startDay=${startDay}&endDay=${endDay}`, { withCredentials: true });
  }

  viewOrderDetails(orderId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/details?id=${orderId}`, { withCredentials: true });
  }
}
