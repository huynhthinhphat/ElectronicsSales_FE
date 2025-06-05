import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../../models/Account.model';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-auth-redirect',
  standalone: false,
  templateUrl: './auth-redirect.component.html',
  styleUrl: './auth-redirect.component.css'
})
export class AuthRedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  role: boolean = false;
  seconds: number = 2;

  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (user) {
      this.authService.checkRole().subscribe({
        next: (res => {
          if (res) {
            this.role = res;
          }
        })
      })
    }

    setInterval(() => {
      if (this.seconds > 0) {
        this.seconds -= 1;
      }
    }, 1000)

    setTimeout(() => {
      if (!user || !this.role) {
        this.router.navigate(['/home']);
      } else if (this.role) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    }, 2000);
  }
}
