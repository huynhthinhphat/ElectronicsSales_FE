import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { buiderHeader } from '../../utils/http-headers.util';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Account } from '../../../models/Account.model';
import { Response } from '../../../models/Response.model';
import { Message } from '../../../models/Message.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:8090/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }

  sentTokenToServer(token: string): void {
    this.http.post<Response<Account>>(`${this.BASE_URL}/login-google`, {}, { headers: buiderHeader(token), withCredentials: true }).subscribe((response: Response<Account>) => {
      this.saveAndRedirect(response);
    });
  }

  signInWithNormal(data: { userName: string; password: string }): void {
    this.http.post<Response<Account>>(`${this.BASE_URL}/login`, data, { withCredentials: true }).subscribe({
      next: (response: Response<Account>) => {
        this.saveAndRedirect(response);
      }
    });
  }

  register(data: { userName: string; password: string }): void {
    this.http.post<Response<any>>(`${this.BASE_URL}/register`, data).subscribe({
      next: (response: Response<any>) => {
        if (response.status === 'success') {
          this.router.navigate(['/login']);
          this.toastr.success(response.message)
        }
      }
    });
  }

  private saveAndRedirect(response: Response<Account>) {
    if (response.data.avatarUrl == null) {
      response.data.avatarUrl = 'assets/images/Avatar_Default.png';
    }
    localStorage.setItem('user', JSON.stringify(response.data));

    if (localStorage.getItem('user')) {
      this.toastr.success(response.message);
      setTimeout(() => {
        this.redirectByRole(response.data.role!);
      }, 1000)
    }
  }

  logout(): void {
    this.http.post<HttpResponse<any>>(`${this.BASE_URL}/logout`, {}, { withCredentials: true, observe: 'response' }).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 200) {
          localStorage.clear();
          if (!localStorage.getItem('user')) {
            this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
              window.history.pushState(null, '', window.location.href);
              window.onpopstate = () => {
                window.location.href = '/home';
              };
            });
            return;
          }
        }
      },
      error: (() => {
        this.toastr.error(Message.ERROR_SERVER);
        return;
      })
    });
  }

  redirectByRole(role: boolean) {
    return role ? location.href = "/admin/dashboard" : location.href = "/home";
  }

  changePassword(data: { userName: string, newPassword: string }): void {
    this.http.put<Response<any>>(`${this.BASE_URL}/update-password`, data).subscribe({
      next: (res: Response<any>) => {
        if (res.status === 'success') {
          localStorage.removeItem('userName');

          if (!localStorage.getItem('userName')) {
            this.router.navigate(['/login']);
            return;
          }
        }
      }
    });
  }

  checkRole(): Observable<any> {
    return this.http.get<Observable<any>>(this.BASE_URL, { withCredentials: true });
  }
}

