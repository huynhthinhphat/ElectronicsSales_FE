import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private BASE_URL = environment.apiUrl + '/api/excel';

  constructor(
    private http: HttpClient
  ) { }

  exportProductsToExcel(search?: string, page: number = 0, limit: number = 6, categoryId?: string, brandId?: string, orderBy?: string) {
    return this.http.get(`${this.BASE_URL}/export_products?search=${search}&page=${page}&limit=${limit}&categoryId=${categoryId}&brandId=${brandId}&orderBy=${orderBy}`, { responseType: 'blob', withCredentials: true });
  }

  exportOrdersToExcel(search: string, page: number, limit: number, status: string, transaction: string, delivery: string, startDay?: string, endDay?: string) {
    return this.http.get(`${this.BASE_URL}/export_orders?search=${search}&page=${page}&limit=${limit}&status=${status}&transaction=${transaction}&delivery=${delivery}&startDay=${startDay}&endDay=${endDay}`, { responseType: 'blob', withCredentials: true });
  }
}
