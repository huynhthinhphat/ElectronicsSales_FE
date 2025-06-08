import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response as ApiResponse } from '../../../models/Response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private BASE_URL = environment.apiUrl + '/api/colors';

  constructor(
    private http: HttpClient,
  ) { }

  viewColors(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}`, { withCredentials: true });
  }
}
