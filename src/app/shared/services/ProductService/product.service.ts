import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomPage } from '../../../models/CustomPage.model';
import { Response as ApiResponse } from '../../../models/Response.model';
import { Product } from '../../../models/Product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private BASE_URL = environment.apiUrl + '/api/products';
  private productName = new BehaviorSubject<any>('');
  sharedData$ = this.productName.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  searchProduct(data: any) {
    this.productName.next(data);
  }

  getProductsByConditions(search?: string, page: number = 0, limit: number = 6, categoryId?: string, brandId?: string, orderBy?: string, startDay?: string, endDay?: string, star?: string): Observable<ApiResponse<CustomPage<Product>>> {
    return this.http.get<ApiResponse<CustomPage<Product>>>(`${this.BASE_URL}?search=${search}&page=${page}&limit=${limit}&categoryId=${categoryId}&brandId=${brandId}&orderBy=${orderBy}&startDay=${startDay}&endDay=${endDay}&star=${star}`, { withCredentials: true });
  }

  getProductDetailsByProductId(id: string): Observable<ApiResponse<CustomPage<Product>>> {
    return this.http.get<ApiResponse<CustomPage<Product>>>(`${this.BASE_URL}/details?id=${id}`, { withCredentials: true });
  }

  updateProduct(product: Product) {
    return this.http.put<ApiResponse<any>>(`${this.BASE_URL}?id=${product.id}`, product, { withCredentials: true });
  }

  deleteProduct(id: string) {
    return this.http.delete<ApiResponse<any>>(`${this.BASE_URL}?id=${id}`, { withCredentials: true });
  }

  viewProductsAreDeleted() {
    return this.http.get<ApiResponse<CustomPage<Product>>>(`${this.BASE_URL}/deleted`, { withCredentials: true });
  }

  restoreProduct(id: string) {
    return this.http.put<ApiResponse<any>>(`${this.BASE_URL}/restore?id=${id}`, {}, { withCredentials: true });
  }

  addProduct(product: Product) {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}`, product, { withCredentials: true });
  }
}
