import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../../../models/Account.model';
import { Response } from '../../../models/Response.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomPage } from '../../../models/CustomPage.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(
    private http: HttpClient
  ) { }

  private BASE_URL = environment.apiUrl + '/api/accounts';

  private emailSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('user') || '{}')?.email || '');
  private fullNameSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('user') || '{}')?.fullName || '');
  email$ = this.emailSubject.asObservable();
  fullName$ = this.fullNameSubject.asObservable();

  updateEmail(email: string | undefined) {
    if (email && email != 'Chưa cập nhật') {
      this.emailSubject.next(email);
    } else {
      this.emailSubject.next('');
    }
  }

  updateFullName(fullName: string | undefined) {
    if (fullName) {
      this.fullNameSubject.next(fullName);
    }
  }

  changePassword(data: { email: string, newPassword: string }) {
    this.http.put<Response<any>>(`${this.BASE_URL}/update-password`, data);
  }

  updateUserInformation(data: Account | null): Observable<Response<Account>> {
    return this.http.put<Response<Account>>(`${this.BASE_URL}/personal`, data, { withCredentials: true });
  }

  cutString(str: string, limit: number) {
    return str && str.length >= limit ? str.substring(0, limit) + '...' : str;
  }

  getUserInfor(): Account | null {
    const userLocalStorage = localStorage.getItem("user");
    return userLocalStorage ? JSON.parse(userLocalStorage) : null;
  }

  viewAccounts(keyWord: string, page: number, limit: number) {
    return this.http.get<Response<CustomPage<Account>>>(`${this.BASE_URL}?search=${keyWord}&page=${page}&limit=${limit}`, { withCredentials: true });
  }

  viewPersonalAccount(id: string) {
    return this.http.get<Response<Account>>(`${this.BASE_URL}/detail?id=${id}`, { withCredentials: true });
  }
}
