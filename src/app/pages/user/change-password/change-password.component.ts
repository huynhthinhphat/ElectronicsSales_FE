import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/AuthService/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  public constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) { }

  password: string = '';
  passwordAgain: string = '';
  isShowPassword: boolean = false;
  isShowPasswordAgain: boolean = false;

  ngOnInit(): void {
    if (!localStorage.getItem("userName")) {
      this.router.navigate(['/home']);
    }
  }

  togglePassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  togglePasswordAgain() {
    this.isShowPasswordAgain = !this.isShowPasswordAgain;
  }

  checkPassword(password: string, passwordAgain: string) {
    return password == passwordAgain;
  }

  submitChangePassword(): void {
    if (!this.checkPassword(this.password, this.passwordAgain)) {
      this.toastr.error('Mật khẩu không trùng khớp');
      return;
    }

    const userName = localStorage.getItem('userName');
    if (!userName) {
      this.toastr.error('Tài khoản không hợp lệ');
      return;
    }

    const data = {
      userName: userName,
      newPassword: this.password
    };

    this.authService.changePassword(data);
  }
}
