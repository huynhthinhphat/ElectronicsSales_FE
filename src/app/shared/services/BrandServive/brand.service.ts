import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../../../models/Category.model';
import { CustomPage } from '../../../models/CustomPage.model';
import { Response as ApiResponse } from '../../../models/Response.model';
import { Brand } from '../../../models/Brand.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private BASE_URL = environment.apiUrl + '/api/brands';
  private brand = new BehaviorSubject<any>('');
  sharedData$ = this.brand.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  searchByBrand(data: string) {
    this.brand.next(data);
  }

  getAllBrands(): Observable<ApiResponse<CustomPage<Brand>>> {
    return this.http.get<ApiResponse<CustomPage<Brand>>>(`${this.BASE_URL}`);
  }

  viewBrands(search: string, page: number, limit: number) {
    return this.http.get<ApiResponse<CustomPage<Brand>>>(`${this.BASE_URL}?search=${search}&page=${page}&limit=${limit}`, { withCredentials: true });
  }

  updateBrand(id: string, brand: Brand) {
    return this.http.put<ApiResponse<any>>(`${this.BASE_URL}?id=${id}`, brand, { withCredentials: true });
  }

  addBrand(brand: Brand) {
    return this.http.post<ApiResponse<Brand>>(`${this.BASE_URL}`, brand, { withCredentials: true });
  }

  deleteBrand(id: string) {
    return this.http.delete<ApiResponse<any>>(`${this.BASE_URL}?id=${id}`, { withCredentials: true });
  }
}
