import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap, tap } from 'rxjs';
import { Message } from '../../../models/Message.model';
import { Order } from '../../../models/Order.model';
import { Product } from '../../../models/Product.model';
import { OrderService } from '../../../shared/services/OrderSerivce/order.service';
import { PayosService } from '../../../shared/services/PayOSSerivce/payos.service';
import { GHNService } from '../../../shared/services/GHNSerivce/ghnservice.service';
import { AccountService } from '../../../shared/services/AccountService/account.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  constructor(
    private GHNService: GHNService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private payosService: PayosService,
    private router: Router,
    private accountService: AccountService
  ) { }

  wardId: string = '';
  seconds: number = 10;
  provinceId: number = 0;
  districtId: number = 0;
  priceOfDelivery: number = 0;
  totalPriceTempOfOrder: number = 0;
  finalTotalPriceOfOrder: number = 0;
  wardName: string = '';
  newAddress: string = '';
  newFullName: string = '';
  noteForOrder: string = '';
  provinceName: string = '';
  districtName: string = '';
  newPhoneNumber: string = '';
  toEstimateDate!: Date;
  fromEstimateDate!: Date;
  paymentMethod: string = 'COD';
  address: string = 'Chưa cập nhật';
  fullName: string = 'Chưa cập nhật';
  phoneNumber: string = 'Chưa cập nhật';
  deliveryMethod: string = 'FAST_DELIVERY';
  isInforFull: boolean = true;
  isLoading: boolean = true;
  isShowDialog: boolean = false;
  isShowAcceptDialog: boolean = false;
  products: Product[] = [];
  suggestions: string[] = [];
  intervalId: any;
  indexProvince: number = -1;
  indexDistrict: number = -1;
  indexWard: number = -1;
  houseAddress: string = '';
  provinces: { ProvinceID: -1, ProvinceName: '' }[] = [];
  districts: { DistrictID: -1, DistrictName: '' }[] = [];
  wards: { WardID: -1, WardName: '' }[] = [];

  ngOnInit(): void {
    this.setUser();
    this.setProductList();
    this.getProvinces();
  }

  setUser() {
    const user = this.accountService.getUserInfor();
    if (user) {
      if (!user.fullName || !user.phoneNumber || !user.address) {
        this.isInforFull = false;
        this.isLoading = false;
        return;
      }

      this.fullName = user.fullName;
      this.phoneNumber = user.phoneNumber;
      this.address = user.address;
      if (this.address.length > 0) {
        const parts = this.address.split(',');

        if (parts.length > 0) {
          this.provinceName = parts[parts.length - 1].trim();
          this.districtName = parts[parts.length - 2].trim();
          this.wardName = parts[parts.length - 3].trim();
        }

        this.getEstimateTime();
      }
    }
  }

  get getPaymentMethod(): string {
    return this.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán trực tuyến: ' + this.paymentMethod;
  }

  get getDeliveryMethod(): string {
    return this.deliveryMethod === 'FAST_DELIVERY' ? 'Giao hàng nhanh GHN' : '' + this.paymentMethod;
  }

  setProductList() {
    const productList = localStorage.getItem('productList');
    if (productList) {
      this.products = JSON.parse(productList);

      for (let product of this.products) {
        if (product?.name && product.name.length > 25) {
          product.name = product.name.substring(0, 25) + '...';
        }

        if (product.priceAtTime && product.quantity) {
          product.totalPrice = product.priceAtTime * product.quantity;
          this.totalPriceTempOfOrder += product.totalPrice;
        }
      }
      this.finalTotalPriceOfOrder = this.totalPriceTempOfOrder + this.priceOfDelivery;
    } else {
      location.href = '/home';
    }
  }

  updatePriceOfDelivery(price: number) {
    this.priceOfDelivery = price;
    this.finalTotalPriceOfOrder = this.totalPriceTempOfOrder + this.priceOfDelivery;
  }

  getEstimateTime() {
    this.GHNService.getProvince().pipe(
      tap(res => {
        if (res?.data?.length > 0) {
          for (let i = 0; i < res.data.length - 1; i++) {
            for (let province of res.data) {
              for (let nameExtension of province.NameExtension) {
                if (this.normalizeText(this.provinceName).includes(this.normalizeText(nameExtension))) {
                  this.provinceId = province.ProvinceID;
                  break;
                }
              }
            }
          }
        }
      }),
      switchMap(() => this.GHNService.getDistrict({ province_id: this.provinceId })),
      tap(res => {
        if (res && res.data && res.data.length > 0) {
          for (let district of res.data) {
            for (let nameExtension of district.NameExtension) {
              if (this.normalizeText(this.districtName).includes(this.normalizeText(nameExtension))) {
                this.districtId = district.DistrictID;
                break;
              }
            }
          }
        }
      }),
      switchMap(() => this.GHNService.getWard({ district_id: this.districtId })),
      tap(res => {
        if (res && res.data && res.data.length > 0) {
          for (let ward of res.data) {
            for (let nameExtension of ward.NameExtension) {
              if (this.normalizeText(this.wardName).includes(this.normalizeText(nameExtension))) {
                this.wardId = ward.WardCode;
                break;
              }
            }
          }
        }
      }),
      switchMap(() => this.GHNService.estimateTime({ from_district_id: 1662, from_ward_code: '370105', to_district_id: this.districtId, to_ward_code: this.wardId, service_id: 100039 }))
    ).subscribe({
      next: (res => {
        const leadTimeOrder = res.data.leadtime_order;
        this.fromEstimateDate = leadTimeOrder.from_estimate_date;
        this.toEstimateDate = leadTimeOrder.to_estimate_date;
      }),
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  private normalizeText(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9\s\u00C0-\u1EF9]/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  redirectUpdateInforUser() {
    this.router.navigate(['user/infor'], {
      state: { isValidRedirect: true }
    });
  }

  showDialog() {
    this.isShowDialog = !this.isShowDialog;
  }

  showAcceptDialog() {
    this.isShowAcceptDialog = !this.isShowAcceptDialog;

    this.intervalId = setInterval(() => {
      this.seconds -= 1;
      if (this.seconds === 0) {
        clearInterval(this.intervalId);
        this.pay();
      }
    }, 1000);
  }

  hiddenAcceptDialog() {
    this.isShowAcceptDialog = !this.isShowAcceptDialog;
    this.seconds = 10;
    clearInterval(this.intervalId);
  }

  saveNewInforForCurrentOrder() {
    let isMissing: boolean = false;

    if (!this.newFullName) {
      isMissing = true;
    }

    if (!this.newPhoneNumber) {
      isMissing = true;
    }

    if (this.indexProvince === -1 || this.indexDistrict === -1 || this.indexWard === -1 || !this.houseAddress) {
      isMissing = true;
    }

    if (isMissing) {
      this.toastr.error(Message.MISSING_INFOR_FOR_ORDER);
      return;
    }

    if (this.newPhoneNumber.length !== 10 || !Number(this.newPhoneNumber)) {
      this.toastr.error(Message.INVALID_PHONE_NUMBER);
      return;
    }

    this.fullName = this.newFullName;
    this.address = this.setAddress();
    this.phoneNumber = this.newPhoneNumber;

    this.isShowDialog = !this.isShowDialog;
    this.toastr.success(Message.SUCCESS_CUSTOM_INFOR_FOR_ORDER);
  }

  stopClickPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  pay() {
    clearInterval(this.intervalId);
    const data: Order = {
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      address: this.address,
      fromCart: history.state.isFromCart,
      totalPrice: this.finalTotalPriceOfOrder,
      status: this.paymentMethod === 'COD' ? 'PENDING' : 'WAITING_FOR_PAYMENT',
      feeDelivery: this.priceOfDelivery,
      paymentMethod: this.paymentMethod,
      delivery: this.deliveryMethod,
      note: this.noteForOrder,
      fromEstimateDate: this.fromEstimateDate,
      toEstimateDate: this.toEstimateDate,
      items: this.products,
    }

    this.orderService.createOrder(data).subscribe({
      next: (res => {
        if (res && res.status === 'success') {
          localStorage.setItem('order', JSON.stringify(res.data));

          if (localStorage.getItem('order')) {
            localStorage.removeItem('productList');

            if (this.paymentMethod === 'COD') {
              this.router.navigate(['checkout/success'], {
                queryParams: { paymentMethod: 'COD' },
                state: { isValidRedirect: true },
                replaceUrl: true
              });
              return;
            }

            const item = res.data;
            if (item) {
              data.id = item.id;
              data.orderCode = item.orderCode;

              this.payosService.createOrder(data).subscribe({
                next: (res => {
                  if (res && res.body && res.body.code === '00') {
                    const checkOutUrl = res.body.data.checkoutUrl;
                    if (checkOutUrl) {
                      location.href = checkOutUrl;
                    }
                  }
                }),
                error: () => {
                  this.hiddenAcceptDialog();
                }
              })
            }

          }
        }
      }),
      error: () => {
        this.hiddenAcceptDialog();
      }
    })
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
