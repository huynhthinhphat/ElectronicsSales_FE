import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Account } from '../../../models/Account.model';
import { Message } from '../../../models/Message.model';
import { AccountService } from '../../../shared/services/AccountService/account.service';
import { ImageService } from '../../../shared/services/ImageService/image.service';
import { GHNService } from '../../../shared/services/GHNSerivce/ghnservice.service';

@Component({
  selector: 'app-account-details',
  standalone: false,
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css'
})
export class AccountDetailsComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private imageService: ImageService,
    private accountService: AccountService,
    private GHNService: GHNService
  ) { };

  gender: any = '';
  email: string = '';
  address: string = '';
  dateOfBirth: any = '';
  fullName: string = '';
  avatarUrl: string = '';
  phoneNumber: string = '';
  isAllowEdit: boolean = false;
  indexProvince: number = -1;
  indexDistrict: number = -1;
  indexWard: number = -1;
  houseAddress: string = '';
  provinces: { ProvinceID: -1, ProvinceName: '' }[] = [];
  districts: { DistrictID: -1, DistrictName: '' }[] = [];
  wards: { WardID: -1, WardName: '' }[] = [];

  ngOnInit(): void {
    this.getProvinces();
    this.showInfor();
    this.loadImg();
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
      this.gender = user.gender === true ? 'Nam' : user.gender === false ? 'Nữ' : 'Chưa cập nhật';
      this.avatarUrl = user.avatarUrl!;
      this.address = this.convertString(user.address!);
    }
  }

  private convertString(str: any): string {
    return str != null ? str : 'Chưa cập nhật';
  }

  private setValueFields(data: any): any {
    return data !== 'Chưa cập nhật' ? data : null;
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

    this.fullName = this.checkAndConvertValue(this.fullName.trim(), user.fullName?.trim());
    this.email = this.checkAndConvertValue(this.email.trim(), user.email?.trim());
    this.phoneNumber = this.checkAndConvertValue(this.phoneNumber.trim(), user.phoneNumber?.trim());
    this.dateOfBirth = this.checkAndConvertValue(this.dateOfBirth, user.dateOfBirth);
    this.gender = this.gender === 'Chưa cập nhật' ? null : (this.gender == 'Nam');

    let newAdress = user.address!;
    if (this.indexProvince !== -1 && this.indexDistrict !== -1 && this.indexWard !== -1 && this.houseAddress) {
      newAdress = this.setAddress();
    }
    this.address = user.address === newAdress ? user.address : newAdress;

    this.accountService.updateUserInformation(this.toNewUserInfor())?.subscribe({
      next: (res => {
        res.data.id = user.id;
        localStorage.setItem('user', JSON.stringify(res.data));

        this.accountService.updateEmail(this.email);
        this.accountService.updateFullName(this.fullName);

        this.toastr.success(res.message);
      }),
      error: () => {
        this.gender = this.gender == true ? 'Nam' : 'Nữ';
      },
      complete: () => {
        this.allowEdit();
      }
    });
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
    return newValue === '' || newValue.length === 0 ? null : (newValue !== oldValue ? newValue : oldValue);
  }

  onFileSelected(event: Event) {
    this.updateAvatarImage(this.imageService.onFilesSelected(event));
  }

  private updateAvatarImage(file: File[]) {
    const user = this.accountService.getUserInfor();
    if (user) {
      this.imageService.uploadMultipleFiles(file).subscribe({
        next: (secureUrl: string[]) => {
          if (secureUrl) {
            user.avatarUrl = secureUrl[0];

            this.accountService.updateUserInformation(user)?.subscribe({
              next: ((res) => {
                localStorage.removeItem('user');

                res.data.id = user.id;
                localStorage.setItem('user', JSON.stringify(res.data));

                this.toastr.success(res.message)
              }),
              complete: () => {
                this.imageService.updateImageUrl(secureUrl[0]);
              }
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

  getProvinces() {
    this.GHNService.getProvince().subscribe({
      next: (res => {
        if (res?.data) {
          for (let province of res.data) {
            this.provinces.push(province);
          }
        }
      })
    })
  }

  getDistricts(event: Event) {
    this.districts = [];
    this.wards = [];
    const target = event.target as HTMLSelectElement;
    const value = Number(target.value);

    if (value !== -1) {
      this.GHNService.getDistrict({ province_id: value }).subscribe({
        next: (res => {
          if (res?.data) {
            for (let district of res.data) {
              this.districts.push(district);
            }
          }
        }),
        complete: () => {
          this.indexProvince = target.selectedIndex;
          this.indexWard = -1;
          this.houseAddress = '';
        }
      })
    }
  }

  getWards(event: Event) {
    this.wards = [];
    const target = event.target as HTMLSelectElement;
    const value = Number(target.value);

    if (value !== -1) {
      this.GHNService.getWard({ district_id: value }).subscribe({
        next: (res => {
          if (res?.data) {
            for (let ward of res.data) {
              this.wards.push(ward);
            }
          }
        }),
        complete: () => {
          this.indexDistrict = target.selectedIndex;
        }
      })
    }
  }

  setIndexWards(event: Event) {
    this.indexWard = Number((event.target as HTMLSelectElement).selectedIndex);
  }

  setAddress(): string {
    return this.houseAddress.trim() + ', ' +
      this.wards[this.indexWard - 1].WardName.trim() + ', ' +
      this.districts[this.indexDistrict - 1].DistrictName.trim() + ', ' +
      this.provinces[this.indexProvince - 1].ProvinceName.trim();
  }
}
