import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  isShowPassword: boolean = false;
  isShowPasswordAgain: boolean = false;
  fullName: string = '';
  username: string = '';
  password: string = '';
  passwordAgain: string = '';

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      location.href = '/home';
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

  onRegister() {
    if (!this.checkPassword(this.password, this.passwordAgain)) {
      this.toastr.warning('Mật khẩu không trùng khớp');
      return;
    }

    const data = {
      fullName: this.fullName,
      userName: this.username,
      password: this.password
    }

    this.authService.register(data);
  }
}
