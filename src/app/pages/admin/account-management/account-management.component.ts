import { Component, OnInit } from '@angular/core';
import { Account } from '../../../models/Account.model';
import { AccountService } from '../../../shared/services/AccountService/account.service';

@Component({
  selector: 'app-account-management',
  standalone: false,
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.css'
})
export class AccountManagementComponent implements OnInit {

  constructor(
    private accountService: AccountService
  ) { }

  page: number = 0;
  limit: number = 20;
  endRecord: number = 0;
  startRecord: number = 1;
  totalElement: number = 0;
  keyWord: string = '';
  isShowDialogDetail: boolean = false;
  account: Account | null = null;
  accounts: Account[] = [];

  ngOnInit(): void {
    this.viewAccounts();
  }

  searchAccounts() {
    this.keyWord = this.keyWord.trim();
    if (!this.keyWord) {
      return;
    } else {
      this.page = 0;
    }
    this.viewAccounts();
  }

  viewAccounts() {
    const recordStartIndex = this.page * this.limit + 1;
    if (recordStartIndex >= this.totalElement && this.totalElement !== 0) {
      this.page = 0;
    }

    this.accountService.viewAccounts(this.keyWord, this.page, this.limit).subscribe({
      next: (res => {
        const data = res?.data;
        if (data) {
          this.totalElement = data.pageInfo?.totalElements ?? 0;
          this.accounts = data.items.map(account => this.formatAccount(account));

          this.startRecord = recordStartIndex > this.totalElement ? 1 : recordStartIndex;
          this.endRecord = Math.min(this.limit * (this.page + 1), this.totalElement);
        }
      })
    })
  }

  closeDialogDetail() {
    this.isShowDialogDetail = false;
    this.account = null;
  }

  viewPersonalAccount(id: string) {
    this.isShowDialogDetail = true;
    this.accountService.viewPersonalAccount(id).subscribe({
      next: (res => {
        if (res) {
          this.account = this.formatAccount(res.data);
          this.account.dateOfBirth = this.account.dateOfBirth == null ? 'Chưa cập nhật' : this.account.dateOfBirth;
          this.account.address = this.account.address == null ? 'Chưa cập nhật' : this.account.address;
        }
      })
    })
  }

  private formatAccount(account: Account): Account {
    return {
      ...account,
      phoneNumber: account.phoneNumber ?? 'Chưa cập nhật',
      role: account.role ? 'Admin' : 'User',
      gender: account.gender === null ? 'Chưa cập nhật' : (account.gender ? 'Nam' : 'Nữ')
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  prePage() {
    this.page--;
    this.viewAccounts();
  }

  nextPage() {
    this.page++;
    this.viewAccounts();
  }

  reset() {
    this.page = 0;
    this.keyWord = '';
    this.limit = 20;
    this.viewAccounts();
  }
}
