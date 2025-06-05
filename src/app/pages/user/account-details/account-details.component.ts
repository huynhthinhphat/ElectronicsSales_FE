import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { Account } from '../../../models/Account.model';
import { Message } from '../../../models/Message.model';
import { AccountService } from '../../../shared/services/AccountService/account.service';
import { ImageService } from '../../../shared/services/ImageService/image.service';
import { LocationService } from '../../../shared/services/LocationService/location-service.service';

@Component({
  selector: 'app-account-details',
  standalone: false,
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css'
})
export class AccountDetailsComponent implements OnInit {
  @ViewChild('inputEmail') inputEmail !: ElementRef;
  @ViewChild('inputFullName') inputFullName !: ElementRef;
  @ViewChild('inputPhoneNumber') inputPhoneNumber !: ElementRef;
  @ViewChild('inputDateOfBirth') inputDateOfBirth !: ElementRef;

  constructor(
    private toastr: ToastrService,
    private imageService: ImageService,
    private accountService: AccountService,
    private locationService: LocationService
  ) { };

  private inputAddress = new Subject<string>();
  private addressSub!: Subscription;
  gender: any = '';
  email: string = '';
  address: string = '';
  dateOfBirth: any = '';
  fullName: string = '';
  avatarUrl: string = '';
  phoneNumber: string = '';
  suggestions: string[] = [];
  isAllowEdit: boolean = false;

  ngOnInit(): void {
    this.showInfor();
    this.loadImg();
    this.setupAutoComplete();
  }

  ngOnDestroy(): void {
    if (this.addressSub) {
      this.addressSub.unsubscribe();
    }
  }

  private loadImg() {
    this.imageService.imageUrl$.subscribe((url) => {
      this.avatarUrl = url;
    });
  }

  showInfor() {
    const user = this.accountService.getUserInfor();
    if (user) {
      this.fullName = this.convertString(user.fullName!);
      this.email = this.convertString(user.email!);
      this.phoneNumber = this.convertString(user.phoneNumber!);
      this.dateOfBirth = this.convertString(user.dateOfBirth!);
      this.gender = this.convertGender(user.gender);
      this.avatarUrl = user.avatarUrl as string;
      this.address = this.convertString(user.address!);
    }
  }

  private convertString(str: any): string {
    return str != null ? str : 'Chưa cập nhật';
  }

  private convertGender(gender: boolean | null | undefined): string {
    return gender === null || gender === undefined ? 'Chưa cập nhật' : (gender ? 'Nam' : 'Nữ');
  }

  allowEdit() {
    this.isAllowEdit = !this.isAllowEdit;
    this.showInfor();
  }

  isSave() {
    const user = this.accountService.getUserInfor();
    if (!user) {
      this.toastr.error(Message.ERROR_INVALID_USER);
      return;
    }

    this.fullName = this.checkAndConvertValue(this.inputFullName.nativeElement.value.trim(), user.fullName?.trim());
    this.email = this.checkAndConvertValue(this.inputEmail.nativeElement.value.trim(), user.email?.trim());
    this.phoneNumber = this.checkAndConvertValue(this.inputPhoneNumber.nativeElement.value.trim(), user.phoneNumber?.trim());
    this.dateOfBirth = this.checkAndConvertValue(this.inputDateOfBirth.nativeElement.value, user.dateOfBirth);
    this.address = this.checkAndConvertValue(this.address?.trim(), user.address?.trim());
    this.gender = this.gender === 'Chưa cập nhật' ? null : (this.gender == 'Nam');

    this.accountService.updateUserInformation(this.toNewUserInfor())?.subscribe({
      next: (res => {
        localStorage.removeItem('user')
        localStorage.setItem('user', JSON.stringify(res.data));

        this.showInfor();
        this.allowEdit();

        this.accountService.updateEmail(this.email);
        this.accountService.updateFullName(this.fullName);

        this.toastr.success(res.message);
        return;
      })
    });
    this.showInfor();
  }

  private toNewUserInfor(): Account {
    return {
      fullName: this.setValueFields(this.fullName),
      gender: this.gender,
      phoneNumber: this.setValueFields(this.phoneNumber),
      email: this.setValueFields(this.email),
      address: this.setValueFields(this.address),
      avatarUrl: this.setValueFields(this.avatarUrl),
      dateOfBirth: this.setValueFields(this.dateOfBirth),
    };
  }

  private checkAndConvertValue(newValue: any, oldValue: any): any {
    return newValue === '' || newValue.length === 0 ? null : newValue !== oldValue ? newValue : oldValue;
  }

  private setValueFields(data: any): any {
    return data !== 'Chưa cập nhật' ? data : null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.toastr.error(Message.ERROR_INVALID_FILE_IMAGE);
        return;
      }

      if (file.size / (1024 * 1024) > 2) {
        this.toastr.error(Message.ERROR_OVER_SZIE_FILE_IMAGE);
        return;
      }

      this.updateAvatarImage(file);
    }
  }

  private updateAvatarImage(file: File) {
    const user = this.accountService.getUserInfor();
    if (user) {
      this.imageService.uploadFileAndGetImageName(file).subscribe({
        next: (secureUrl: string) => {
          if (secureUrl) {
            user.avatarUrl = secureUrl;
            this.accountService.updateUserInformation(user)?.subscribe({
              next: ((res) => {
                localStorage.removeItem('user');
                localStorage.setItem('user', JSON.stringify(res.data));

                this.imageService.updateImageUrl(secureUrl);
                this.toastr.success(res.message)
              })
            });
          }
        },
        error: () => {
          this.toastr.error(Message.ERROR_FROM_CLOUNDARY);
        },
      })
    }
  }

  getClass(value?: string) {
    return value === 'Chưa cập nhật' ? 'text-gray-400' : 'font-semibold';
  }

  private setupAutoComplete(): void {
    this.inputAddress.pipe(
      debounceTime(2000)
    ).subscribe((address: string) => {
      if (this.isAllowEdit) {
        this.locationService.autoComplete(address).subscribe((res: any) => {
          if (res.predictions.length > 0) {
            this.suggestions = res.predictions.map((item: any) => item.description);
          }
        });
      }
    });
  }

  getLocations(event: Event) {
    this.address = (event.target as HTMLInputElement).value;
    if (this.address.trim().length > 0) {
      this.inputAddress.next(this.address)
    }
  }
}
