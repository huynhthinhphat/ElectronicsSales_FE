import { Component } from '@angular/core';
import { GoogleLoginService } from '../../services/AuthGoogle/auth-google.service';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(
    private authService: AuthService,
    private googleLogin: GoogleLoginService) {
  };

  isShow: boolean = false;
  username: string = '';
  password: string = '';
  user: any;
  email: string = '';

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      location.href = '/home';
    }

    this.googleLogin.initTokenClient();
  }

  togglePassword() {
    this.isShow = !this.isShow;
  }

  signInWithNormal(): void {
    const data = {
      userName: this.username,
      password: this.password
    };

    this.authService.signInWithNormal(data);
  }

  signInWithGoogle(): void {
    this.googleLogin.signInWithPopup();
  }
}
