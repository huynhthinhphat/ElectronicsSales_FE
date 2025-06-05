import { Injectable } from '@angular/core';
import { Order } from '../../../models/Order.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PayosService {

  constructor(private http: HttpClient) { }

  private BASE_URL = 'http://localhost:8090/api/payos';

  createOrder(data: Order): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/create`, data, { withCredentials: true });
  }
}
