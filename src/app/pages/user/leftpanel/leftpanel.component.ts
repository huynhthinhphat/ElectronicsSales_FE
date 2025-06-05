import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ImageService } from '../../../shared/services/ImageService/image.service';
import { filter } from 'rxjs';
import { AccountService } from '../../../shared/services/AccountService/account.service';

@Component({
  selector: 'app-leftpanel',
  standalone: false,
  templateUrl: './leftpanel.component.html',
  styleUrl: './leftpanel.component.css'
})
export class LeftpanelComponent implements OnInit {

  public constructor(
    private imageService: ImageService,
    private router: Router,
    private accountService: AccountService
  ) { }

  email: string = '';
  fullName: string = '';
  avatarUrl: string = '';
  currentUrl: string = '';

  ngOnInit(): void {
    this.setUser();
    this.loadData();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = (event as NavigationEnd).urlAfterRedirects;
      });

    this.currentUrl = this.router.url;
  }

  private loadData() {
    this.imageService.imageUrl$.subscribe((url) => {
      this.avatarUrl = url;
    });

    this.accountService.fullName$.subscribe((fullName) => {
      this.fullName = this.accountService.cutString(fullName!, 18);
    });

    this.accountService.email$.subscribe((email) => {
      this.email = this.accountService.cutString(email!, 20);
    });
  }

  private setUser() {
    const user = this.accountService.getUserInfor();
    if (user) {
      if (user.avatarUrl) {
        this.avatarUrl = user.avatarUrl;
      }
      if (user.fullName) {
        this.fullName = this.accountService.cutString(user.fullName!, 19);
      }
      if (user.email) {
        this.email = this.accountService.cutString(user.email!, 20);
      }
    }
  }

  goToInfor() {
    this.router.navigate(['user/infor'], {
      state: { isValidRedirect: true }
    });
  }

  goToOrder() {
    this.router.navigate(['user/orders'], {
      state: { isValidRedirect: true }
    });
  }
}
