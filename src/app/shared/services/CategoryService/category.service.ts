import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomPage } from '../../../models/CustomPage.model';
import { Response as ApiResponse } from '../../../models/Response.model';
import { Category } from '../../../models/Category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private BASE_URL = 'http://localhost:8090/api/categories';

  constructor(
    private http: HttpClient,
  ) { }

  getAllCategories(): Observable<ApiResponse<CustomPage<Category>>> {
    return this.http.get<ApiResponse<CustomPage<Category>>>(`${this.BASE_URL}`);
  }

  viewCategories(search: string, page: number, limit: number) {
    return this.http.get<ApiResponse<CustomPage<Category>>>(`${this.BASE_URL}?search=${search}&page=${page}&limit=${limit}`, { withCredentials: true });
  }

  updateCategory(id: string, category: Category) {
    return this.http.put<ApiResponse<any>>(`${this.BASE_URL}?id=${id}`, category, { withCredentials: true });
  }

  addCategory(category: Category) {
    return this.http.post<ApiResponse<Category>>(`${this.BASE_URL}`, category, { withCredentials: true });
  }

  deleteCategory(id: string) {
    return this.http.delete<ApiResponse<any>>(`${this.BASE_URL}?id=${id}`, { withCredentials: true });
  }
}
