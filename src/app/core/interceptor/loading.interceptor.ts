import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Account } from '../../models/Account.model';
import { Router } from '@angular/router';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const spinner = inject(NgxSpinnerService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  const userLocalStorage = localStorage.getItem('user');
  const user: Account = userLocalStorage ? JSON.parse(userLocalStorage) : null;
  let spinnerName = '';
  spinnerName = user == null ? 'global' : (user.role ? 'section' : 'global');

  spinner.show(spinnerName);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          setTimeout(() => {
            localStorage.removeItem('user');
            location.href = '/login';
            router.navigate(['/login'], { replaceUrl: true });
          }, 2000)
        }
        const res = error.error as { message?: string };
        toastr.error(res?.message || 'Đã xảy ra lỗi không xác định!');
      }
      return throwError(() => error);
    }),
    finalize(() => spinner.hide(spinnerName))
  );
};
