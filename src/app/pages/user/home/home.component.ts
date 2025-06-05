import { Component, OnInit } from '@angular/core';
import { Response } from '../../../models/Response.model';
import { combineLatest } from 'rxjs';
import { Category } from '../../../models/Category.model';
import { CustomPage } from '../../../models/CustomPage.model';
import { Product } from '../../../models/Product.model';
import { BrandService } from '../../../shared/services/BrandServive/brand.service';
import { CategoryService } from '../../../shared/services/CategoryService/category.service';
import { ProductService } from '../../../shared/services/ProductService/product.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private brandService: BrandService
  ) { }

  products: Product[] = [];
  categories: Category[] = [];
  search: string = '';
  orderBy: string = '';
  selectedActive: string = '';
  selectedBrandId: string = '';
  selectedOrderBy: string = '';
  selectedCategoryId: string = '';
  page: number = 0;
  maxVisiblePages = 5;
  totalPages: number = 0;
  endDay: string = '';

  trackById(item: any) {
    return item.id;
  }

  ngOnInit(): void {
    this.initDate();
    this.getAllCategories();
    this.combineProductAndBrand();
  }

  initDate(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    this.endDay = `${year}-${month}-${day}`;
  }

  combineProductAndBrand() {
    combineLatest([
      this.productService.sharedData$,
      this.brandService.sharedData$
    ]).subscribe(([searchKeyword, brandId]) => {
      if (searchKeyword !== null) {
        this.search = searchKeyword;
      }
      if (brandId !== null) {
        this.selectedBrandId = brandId;
      }

      this.getProductByConditions(this.search, this.selectedCategoryId, this.selectedBrandId, this.selectedOrderBy);
    });
  }

  private getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: ((res: Response<CustomPage<Category>>) => {
        if (res.data.items.length > 0) {
          this.categories = res.data.items;

          const allCategory: Category = {
            id: '',
            name: 'Tất cả sản phẩm'
          };
          this.categories.unshift(allCategory);
        }
      })
    })
  }

  getProductByConditions(search: string, categoryId: string, brandId: string, event: any) {
    let orderBy = '';
    if (event.target instanceof HTMLSelectElement) {
      orderBy = event.target.value;
    } else {
      orderBy = event;
      this.selectedActive = '';
    }

    if (this.selectedCategoryId === categoryId && this.selectedBrandId === brandId && this.selectedOrderBy === orderBy) {
      orderBy = '';
      this.selectedOrderBy = '';
    }

    this.selectedCategoryId = categoryId;
    this.selectedOrderBy = orderBy;

    this.productService.getProductsByConditions(search, this.page, 12, categoryId, brandId, this.selectedOrderBy, '2025-01-01', this.endDay, '').subscribe({
      next: (res => {
        if (res) {
          this.products = [];
          if (res.data.items.length > 0) {
            this.products = res.data.items;
            this.totalPages = res.data.pageInfo.totalPages;
          }
        }
      })
    });
  }

  truncateName(name?: string, limit: number = 15): string {
    if (!name) return '';
    return name.length > limit ? name.slice(0, limit) + '...' : name;
  }

  get visiblePages(): number[] {
    const half = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(0, this.page - half);
    let end = Math.min(this.totalPages, start + this.maxVisiblePages);
    start = Math.max(0, end - this.maxVisiblePages);

    return Array(end - start).fill(0).map((_, i) => start + i);
  }

  changePage(index: number) {
    if (index >= 0 && index < this.totalPages) {
      this.page = index;
      this.getProductByConditions(this.search, this.selectedCategoryId, this.selectedBrandId, this.selectedOrderBy);
    }
  }
}
