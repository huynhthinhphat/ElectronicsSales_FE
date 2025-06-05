import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/CategoryService/category.service';
import { Category } from '../../../models/Category.model';
import { ToastrService } from 'ngx-toastr';
import { Message } from '../../../models/Message.model';

@Component({
  selector: 'app-category-management',
  standalone: false,
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  constructor(
    private categorySevice: CategoryService,
    private toastr: ToastrService
  ) { }

  categories: Category[] = [];
  category: Category | null = null;
  page: number = 0;
  limit: number = 20;
  endRecord: number = 0;
  startRecord: number = 1;
  totalElement: number = 0;
  title: string = '';
  newDes: string = '';
  keyWord: string = '';
  newName: string = '';
  idOfCategoryDelete: string = '';
  nameOfCategoryDelete: string = '';
  isChange: boolean = false;
  isShowDialogDetail: boolean = false;
  isShowDialogDelete: boolean = false;

  ngOnInit(): void {
    this.viewCategories();
  }

  searchCategories() {
    this.keyWord = this.keyWord.trim();
    if (!this.keyWord) {
      return;
    } else {
      this.page = 0;
    }
    this.viewCategories();
  }

  viewCategories() {
    const recordStartIndex = this.page * this.limit + 1;
    if (recordStartIndex >= this.totalElement && this.totalElement !== 0) {
      this.page = 0;
    }

    this.categorySevice.viewCategories(this.keyWord, this.page, this.limit).subscribe({
      next: (res => {
        const data = res?.data;
        if (data) {
          this.totalElement = data.pageInfo?.totalElements ?? 0;
          this.categories = data.items as Category[];

          this.startRecord = recordStartIndex > this.totalElement ? 1 : recordStartIndex;
          this.endRecord = Math.min(this.limit * (this.page + 1), this.totalElement);
        }
      })
    })
  }

  viewCategoryDetail(id: string | null) {
    if (id !== null) {
      for (const item of this.categories) {
        if (item.id === id) {
          this.title = 'Cập nhật thể loại'
          this.category = item;
          this.newName = this.category.name as string;
          this.newDes = this.category.description as string;
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
    this.category = null;
    this.newDes = '';
    this.newName = '';
    this.nameOfCategoryDelete = '';
    this.idOfCategoryDelete = '';
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  prePage() {
    this.page--;
    this.viewCategories();
  }

  nextPage() {
    this.page++;
    this.viewCategories();
  }

  reset() {
    this.page = 0;
    this.keyWord = '';
    this.limit = 20;
    this.viewCategories();
  }

  update(id: string, category: Category) {
    category.name = this.newName;
    category.description = this.newDes;

    this.categorySevice.updateCategory(id, category).subscribe({
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
      this.toastr.error(Message.MISSING_CATEGORY_NAME);
      return;
    }

    const category: Category = {
      name: this.newName,
      description: this.newDes
    }

    this.categorySevice.addCategory(category).subscribe({
      next: (res => {
        if (res) {
          this.toastr.success(res.message);
          this.closeAllDialogs();
          this.categories.unshift(res.data)
        }
      })
    })
  }

  isChangeField(newName: string, newDes: string) {
    this.newName = newName;
    this.newDes = newDes;

    if (this.newName !== this.category?.name || this.newDes !== this.category?.description) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  showDialogDelete(category: Category) {
    this.idOfCategoryDelete = category.id as string;
    this.nameOfCategoryDelete = category.name as string;
    this.isShowDialogDelete = true;
  }

  deleteCategory() {
    this.categorySevice.deleteCategory(this.idOfCategoryDelete).subscribe({
      next: (res => {
        if (res) {
          this.toastr.success(res.message);
          this.categories = this.categories.filter(category => category.id !== this.idOfCategoryDelete);
          this.closeAllDialogs();
        }
      })
    })
  }
}
