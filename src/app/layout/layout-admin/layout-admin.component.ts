import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../shared/services/AccountService/account.service';
import { AuthService } from '../../shared/services/AuthService/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout-admin',
  standalone: false,
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.css'
})
export class LayoutAdminComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  currentUrl: string = '/admin/dashboard';

  ngOnInit(): void {
    this.getCurrentUrl();
  }

  getCurrentUrl() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = (event as NavigationEnd).urlAfterRedirects;
      });

    this.currentUrl = this.router.url;
  }

  redirect(index: number) {
    let url = '';
    if (index === 0) {
      url = '/admin/dashboard';
    } else if (index === 1) {
      url = '/admin/accounts';
    } else if (index === 2) {
      url = '/admin/categories';
    } else if (index === 3) {
      url = '/admin/brands';
    } else if (index === 4) {
      url = '/admin/products';
    } else if (index === 5) {
      url = '/admin/orders';
    } else if (index === 6) {
      url = '/admin/comments';
    } else if (index === 7) {
      url = '/admin/trash';
    }

    this.router.navigate([url], {
      state: { isValidRedirect: true }
    });
  }

  logOut() {
    this.authService.logout();
  }
}
