import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ForgotPasswordService } from '../../../shared/services/ForgotPasswordService/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  public constructor(
    private forgotPasswordService: ForgotPasswordService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  seconds: number = 0;
  minutes: number = 0;
  timeInterval: any;
  OTP: string = '';
  userName: string = '';
  title = 'Quên mật khẩu';
  msg: string = 'Nhận mã';
  isDisabled: boolean = false;
  isShowLogin: boolean = true;

  ngOnInit(): void {
    this.changeTitle();
  }

  private changeTitle() {
    if (this.router.url === '/verify-email') {
      this.title = 'Bạn cần xác minh email để đổi mật khẩu';
      this.isShowLogin = false;
    }
  }

  getOTP() {
    if (this.userName) {
      this.forgotPasswordService.getOTP(this.userName).subscribe({
        next: (res) => {
          if (res) {
            this.toastr.success(res?.message);
          }
        },
        complete: () => {
          this.isDisabled = true;
          this.startInterval();
        }
      })
    } else {
      this.toastr.info("Không để trống tài khoản")
    }
  }

  verifyOTP() {
    this.forgotPasswordService.verifyOTP(this.userName, this.OTP);
  }

  startInterval() {
    this.seconds = 59;
    this.minutes = 4;
    this.msg = `Gửi lại sau: ${this.minutes}:${this.seconds}`;
    this.timeInterval = setInterval(() => {
      if (this.seconds === 0 && this.minutes === 0) {
        this.stopInterval();
        this.msg = 'Gửi lại';
        this.isDisabled = false;
        return;
      }

      if (this.seconds === 0 && this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }

      this.msg = `Gửi lại sau: ${this.minutes}:${this.seconds < 10 ? '0' + this.seconds : this.seconds}`;
    }, 1000)
  }

  stopInterval() {
    clearInterval(this.timeInterval);
  }
}
