import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth.service';
import { CartService } from '../../services/CartService/cart.service';

@Component({
  selector: 'app-auth-redirect',
  standalone: false,
  templateUrl: './auth-redirect.component.html',
  styleUrl: './auth-redirect.component.css'
})
export class AuthRedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  role: boolean = false;

  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (user) {
      this.authService.checkRole().subscribe({
        next: (res => {
          if (res) {
            this.role = res.role;
            this.cartService.updateTotalQuantityOfCart(res.totalQuantity || 0);
          }
        })
      })
    }

    setTimeout(() => {
      if (!user || !this.role) {
        this.router.navigate(['/home']);
      } else if (this.role) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    }, 1000);
  }
}
