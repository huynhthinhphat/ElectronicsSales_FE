import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/AuthService/auth.service';
import { Account } from '../../models/Account.model';
import { ImageService } from '../../shared/services/ImageService/image.service';
import { ProductService } from '../../shared/services/ProductService/product.service';
import { Product } from '../../models/Product.model';
import { Response as ApiResponse } from '../../models/Response.model';
import { CustomPage } from '../../models/CustomPage.model';
import { CartService } from '../../shared/services/CartService/cart.service';
import { Router } from '@angular/router';
import { BrandService } from '../../shared/services/BrandServive/brand.service';
import { Brand } from '../../models/Brand.model';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-layout-user',
  standalone: false,
  templateUrl: './layout-user.component.html',
  styleUrl: './layout-user.component.css'
})
export class LayoutUserComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private imageService: ImageService,
    private productService: ProductService,
    private brandService: BrandService,
    private cartService: CartService,
    private router: Router
  ) { }

  isLogin: boolean = false;
  fullName: string = '';
  avatarUrl: string = '';
  totalQuantity: number = 0;
  products: Product[] = [];
  search: string = '';
  brands: Brand[] = [];
  selectedBrandId: string = ''
  private destroy$ = new Subject<void>();
  visible: boolean = false;
  endDay: string = '';

  ngOnInit(): void {
    this.initDate();
    this.loadImg();
    this.getAllProducts();
    this.getAllBrands();
    this.showInforUserOnHeader();
    this.updateTotalQuantity();

    if (!localStorage.getItem('user')) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateTotalQuantity() {
    this.cartService.updateTotalQuantity$.subscribe(() => {
      const user = this.getUserFromLocalStorage();
      if (user) {
        this.totalQuantity = Number(user.totalQuantity);
      }
    });
  }

  private initDate(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    this.endDay = `${year}-${month}-${day}`;
  }

  getAllBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (res => {
        if (res?.data?.items) {
          this.brands = res.data.items as Brand[];

          const allBrand: Brand = {
            id: '',
            name: 'Tất cả'
          };
          this.brands.unshift(allBrand);
        }
      })
    });
  }

  getAllProducts() {
    this.productService.getProductsByConditions('', 0, 10, '', '', '', '2025-01-01', this.endDay, '').subscribe({
      next: ((res: ApiResponse<CustomPage<Product>>) => {
        if (res?.data?.items) {
          this.products = [];
          this.products = res.data.items;
        }
      })
    });
  }

  private loadImg() {
    this.imageService.imageUrl$.subscribe((url) => {
      this.avatarUrl = url;
    });
  }

  showInforUserOnHeader() {
    const user = this.getUserFromLocalStorage();

    if (user) {
      this.isLogin = true;
      if (user.fullName) {
        this.fullName = user.fullName;
      }
      if (user.avatarUrl) {
        this.avatarUrl = user.avatarUrl;
      }
      return;
    }
    this.isLogin = false;
  }

  logout() {
    this.authService.logout();
  }

  searchProduct() {
    this.router.navigate(['/home']).then(() => {
      this.productService.searchProduct(this.search.trim());
    });
  }

  goToInfor() {
    this.router.navigate(['user/infor'], {
      state: { isValidRedirect: true }
    });
  }

  goToCart() {
    const user = this.getUserFromLocalStorage();

    if (user) {
      this.router.navigate(['cart'], {
        queryParams: { id: user.id },
        state: { isValidRedirect: true }
      });
    }
  }

  private getUserFromLocalStorage(): Account | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  searchByBrand(brand: string) {
    this.router.navigate(['/home']).then(() => {
      this.selectedBrandId = brand;
      this.brandService.searchByBrand(brand);
    });
  }
}