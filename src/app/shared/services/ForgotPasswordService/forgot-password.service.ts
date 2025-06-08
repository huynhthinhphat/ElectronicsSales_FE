import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../../../models/Response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private BASE_URL = environment.apiUrl + '/api/email';

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  getOTP(userName: string) {
    const params = new HttpParams().set('userName', userName);
    return this.http.post<Response<any>>(`${this.BASE_URL}`, null, { params });
  }

  verifyOTP(userName: string, OTP: string) {
    const params = new HttpParams().set('userName', userName).set('OTP', OTP);
    return this.http.post<Response<any>>(`${this.BASE_URL}/verify`, null, { params }).subscribe({
      next: (res: Response<any>) => {
        if (res.status === 'success') {
          this.toastr.success(res.message)
          localStorage.setItem("userName", userName);
          if (localStorage.getItem("userName")) {
            this.router.navigate(['/change-password']);
          }
        }
      }
    });
  }
}
