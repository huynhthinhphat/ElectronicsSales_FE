import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../models/Product.model';
import { ProductService } from '../../../shared/services/ProductService/product.service';

@Component({
  selector: 'app-trash-product-management',
  standalone: false,
  templateUrl: './trash-product-management.component.html',
  styleUrl: './trash-product-management.component.css'
})
export class TrashProductManagementComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) { }

  products: Product[] = [];
  productId: string | null = '';
  productName: string | null = '';
  isShowDialogConfirm: boolean = false;

  ngOnInit(): void {
    this.viewProductsAreDeleted();
  }

  viewProductsAreDeleted() {
    this.productService.viewProductsAreDeleted().subscribe({
      next: (res => {
        const data = res?.data;
        if (data) {
          this.products = data.items;
        }
      })
    })
  }

  toggleDialogConfirm(id: string | null, name: string | null) {
    this.productId = id;
    this.productName = name;
    this.isShowDialogConfirm = !this.isShowDialogConfirm;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  restoreProduct() {
    if (this.productId) {
      this.productService.restoreProduct(this.productId).subscribe({
        next: (res => {
          if (res && res.status === 'success') {
            this.toastr.success(res.message);
            this.products = this.products.filter(p => p.id !== this.productId);
            this.toggleDialogConfirm(null, null);
          }
        })
      })
    }
  }
}
