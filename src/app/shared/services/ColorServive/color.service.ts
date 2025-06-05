import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response as ApiResponse } from '../../../models/Response.model';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private BASE_URL = 'http://localhost:8090/api/colors';

  constructor(
    private http: HttpClient,
  ) { }

  viewColors(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}`, { withCredentials: true });
  }
}
