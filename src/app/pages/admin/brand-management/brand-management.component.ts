import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Brand } from '../../../models/Brand.model';
import { Message } from '../../../models/Message.model';
import { BrandService } from '../../../shared/services/BrandServive/brand.service';

@Component({
  selector: 'app-brand-management',
  standalone: false,
  templateUrl: './brand-management.component.html',
  styleUrl: './brand-management.component.css'
})
export class BrandManagementComponent implements OnInit {
  constructor(
    private brandService: BrandService,
    private toastr: ToastrService
  ) { }

  brands: Brand[] = [];
  brand: Brand | null = null;
  page: number = 0;
  limit: number = 20;
  endRecord: number = 0;
  startRecord: number = 1;
  totalElement: number = 0;
  title: string = '';
  newDes: string = '';
  keyWord: string = '';
  newName: string = '';
  idOfBrandDelete: string = '';
  nameOfBrandDelete: string = '';
  isChange: boolean = false;
  isShowDialogDetail: boolean = false;
  isShowDialogDelete: boolean = false;

  ngOnInit(): void {
    this.viewBrands();
  }

  searchBrands() {
    this.keyWord = this.keyWord.trim();
    if (!this.keyWord) {
      return;
    } else {
      this.page = 0;
    }
    this.viewBrands();
  }

  viewBrands() {
    const recordStartIndex = this.page * this.limit + 1;
    if (recordStartIndex >= this.totalElement && this.totalElement !== 0) {
      this.page = 0;
    }

    this.brandService.viewBrands(this.keyWord, this.page, this.limit).subscribe({
      next: (res => {
        const data = res?.data;
        if (data) {
          this.totalElement = data.pageInfo?.totalElements ?? 0;
          this.brands = data.items as Brand[];

          this.startRecord = recordStartIndex > this.totalElement ? 1 : recordStartIndex;
          this.endRecord = Math.min(this.limit * (this.page + 1), this.totalElement);
        }
      })
    })
  }

  viewBrandDetail(id: string | null) {
    if (id !== null) {
      for (const item of this.brands) {
        if (item.id === id) {
          this.title = 'Cập nhật thể loại'
          this.brand = item;
          this.newName = this.brand.name as string;
          this.newDes = this.brand.description as string;
        }
      }
    } else {
      this.title = 'Thêm thể loại mới'
    }
    this.isShowDialogDetail = true;
  }

  closeAllDialogs() {
    this.isShowDialogDetail = false;
    this.isShowDialogDelete = false;
    this.brand = null;
    this.newDes = '';
    this.newName = '';
    this.nameOfBrandDelete = '';
    this.idOfBrandDelete = '';
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  prePage() {
    this.page--;
    this.viewBrands();
  }

  nextPage() {
    this.page++;
    this.viewBrands();
  }

  reset() {
    this.page = 0;
    this.keyWord = '';
    this.limit = 20;
    this.viewBrands();
  }

  update(id: string, brand: Brand) {
    brand.name = this.newName;
    brand.description = this.newDes;

    this.brandService.updateBrand(id, brand).subscribe({
      next: (res => {
        if (res) {
          this.toastr.success(res.message);
          this.closeAllDialogs();
        }
      })
    })
  }

  create() {
    if (!this.newName) {
      this.toastr.error(Message.MISSING_BRAND_NAME);
      return;
    }

    const brand: Brand = {
      name: this.newName,
      description: this.newDes
    }

    this.brandService.addBrand(brand).subscribe({
      next: (res => {
        if (res) {
          this.toastr.success(res.message);
          this.closeAllDialogs();
          this.brands.unshift(res.data)
        }
      })
    })
  }

  isChangeField(newName: string, newDes: string) {
    this.newName = newName;
    this.newDes = newDes;

    if (this.newName !== this.brand?.name || this.newDes !== this.brand?.description) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  showDialogDelete(brand: Brand) {
    this.idOfBrandDelete = brand.id as string;
    this.nameOfBrandDelete = brand.name as string;
    this.isShowDialogDelete = true;
  }

  deleteBrand() {
    this.brandService.deleteBrand(this.idOfBrandDelete).subscribe({
      next: (res => {
        if (res) {
          this.toastr.success(res.message);
          this.brands = this.brands.filter(brand => brand.id !== this.idOfBrandDelete);
          this.closeAllDialogs();
        }
      })
    })
  }
}
