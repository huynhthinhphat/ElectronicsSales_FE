import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomPage } from '../../../models/CustomPage.model';
import { Message } from '../../../models/Message.model';
import { Product } from '../../../models/Product.model';
import { CartService } from '../../../shared/services/CartService/cart.service';
import { ProductService } from '../../../shared/services/ProductService/product.service';
import { Response as ApiResponse } from '../../../models/Response.model';
import { ReviewService } from '../../../shared/services/ReviewServive/review.service';
import { forkJoin } from 'rxjs';
import { Review } from '../../../models/Review.model';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('zoomedImage') zoomedImage!: ElementRef;
  @ViewChild('mainImageUrl') mainImageUrl!: ElementRef;

  constructor(
    private activedRoute: ActivatedRoute,
    private productService: ProductService,
    private toastr: ToastrService,
    private cartService: CartService,
    private route: Router,
    private reviewService: ReviewService
  ) { }

  productId: string = '';
  selectedColor: string = '';
  selectedMainImageUrl: string = '';
  product?: Product;
  quantity: number = 1;
  isZoom: boolean = false;
  color: any;
  zoomStyle: any = {};
  colors: string[] = [];
  images: string[] = [];
  reviews: Review[] = [];
  selectedImage: string = '';
  reviewIndex: number = -1;
  imageIndex: number = -1;
  max: number = 0;
  orderBy: string = '';

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.activedRoute.queryParams.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        forkJoin({
          products: this.productService.getProductDetailsByProductId(this.productId),
          reviews: this.reviewService.viewReviewsOfUser(this.productId, this.orderBy)
        }).subscribe({
          next: ({ products, reviews }) => {
            if (products) {
              this.setProduct(products);
            }

            if (reviews) {
              this.reviews = reviews.data.items;
            }
          },
          error: (error) => {
            console.error(error)
          }
        })
      } else {
        location.href = '/home';
      }
    });
  }

  viewReviews() {
    this.reviewService.viewReviewsOfUser(this.productId, this.orderBy).subscribe({
      next: (res => {
        if (res?.data) {
          this.reviews = res.data.items;
        }
      })
    })
  }

  getProductDetailsByProductId() {
    this.productService.getProductDetailsByProductId(this.productId).subscribe({
      next: ((res: ApiResponse<CustomPage<Product>>) => {
        if (res) {
          this.setProduct(res);
        }
      })
    })
  }

  private setProduct(res: any) {
    const product = res.data as Product;
    this.product = product;
    this.colors = product.colors as string[];

    const images = [...product.images || []];
    images.unshift(product.mainImageUrl!)
    this.images = images;

    this.selectedMainImageUrl = product.mainImageUrl as string;
    this.selectedColor = this.colors[0];
  }

  addToCart() {
    if (!localStorage.getItem('user')) {
      this.toastr.info(Message.PLEASE_LOGIN_TO_ADD_TO_CART);
      return;
    }

    this.checkColorValid(Message.MISSING_COLOR_SELECTION_TO_ADD_CART);
    if (!this.checkQuantityAndStock()) {
      return;
    }

    const data = { id: this.productId, quantity: this.quantity, color: this.selectedColor };
    this.cartService.addItemsToCart(data).subscribe({
      next: (res => {
        if (res.status === 'success') {
          this.toastr.success(Message.SUCCESS_ADD_TO_CART);
          this.cartService.updateTotalQuantityOfCart(res.data.totalQuantity);
          return;
        }
      })
    })
  }

  checkColorValid(msg: string): boolean {
    if (this.selectedColor === '') {
      this.toastr.error(msg);
      return false;
    }
    return true;
  }

  checkQuantityAndStock(): boolean {
    if (this.quantity < 0 || !Number(this.quantity)) {
      this.toastr.error(Message.INVALID_QUANTITY);
      return false;
    }

    if (this.product?.stock && this.quantity > this.product.stock) {
      this.toastr.error(Message.ERROR_INSUFFICIENT_STOCK);
      return false;
    }

    if (this.quantity == 0) {
      this.toastr.error(Message.ERROR_QUANTITY_MUST_BE_GREATER_THAN_ZERO);
      return false;
    }

    return true;
  }

  changeColor(color: string) {
    this.selectedColor = color;
  }

  updateQuantityAddOrOrder(event: any) {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.quantity = Number(target.value);
    } else {
      this.quantity = Number(event);
    }
  }

  changeMainImageUrl(imageId: string) {
    this.selectedMainImageUrl = imageId;
  }

  onMouseMove(event: MouseEvent) {
    this.isZoom = true;

    if (this.isZoom) {
      const mainRect = this.mainImageUrl.nativeElement.getBoundingClientRect();
      const offsetX = event.clientX - mainRect.left;
      const offsetY = event.clientY - mainRect.top;

      const percentX = (offsetX / mainRect.width) * 100;
      const percentY = (offsetY / mainRect.height) * 100;

      this.zoomStyle = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`,
        'background-image': `url('${this.selectedMainImageUrl}')`,
        'background-size': '700px auto',
        'background-repeat': 'no-repeat',
        'background-position': `${percentX}% ${percentY}%`,
        'box-shadow': '0 0 10px rgba(0, 0, 0, 0.6)',
        transform: 'translate(-50%, -50%)'
      };
    }
  }

  leaveImage() {
    this.isZoom = false;
  }

  buyNow() {
    if (!localStorage.getItem('user')) {
      this.toastr.info(Message.PLEASE_LOGIN_TO_ADD_TO_BUY);
      return;
    }

    if (!this.checkQuantityAndStock()) {
      return;
    }

    const data: Product[] = [
      {
        id: this.product?.id,
        sku: this.product?.sku,
        name: this.product?.name,
        mainImageUrl: this.product?.mainImageUrl,
        color: this.selectedColor,
        quantity: this.quantity,
        priceAtTime: this.product?.discountPrice,
        price: this.product?.discountPrice,
        totalPrice: (this.product?.discountPrice || 0) * this.quantity
      }
    ]

    const productList = localStorage.getItem('productList');
    if (productList) {
      localStorage.removeItem('productList');
    }
    localStorage.setItem('productList', JSON.stringify(data));
    this.route.navigate(['/checkout'], {
      state: { isValidRedirect: true }
    });
  }

  zoomImage(reviewIndex: number, imageIndex: number, max: number) {
    this.max = max;
    this.reviewIndex = reviewIndex;
    this.imageIndex = imageIndex;
    this.updateImageSrc();
  }

  updateImageSrc() {
    const selectedImage = this.reviews?.[this.reviewIndex]?.images?.[this.imageIndex];
    if (selectedImage) {
      this.selectedImage = selectedImage;
    }
  }

  closeBigImage() {
    this.selectedImage = '';
    this.max = 0;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  preImage(event: Event) {
    event.stopPropagation();
    if (this.imageIndex <= 0) {
      this.imageIndex = this.max - 1;
    } else {
      this.imageIndex--;
    }
    this.updateImageSrc();
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.imageIndex >= this.max - 1) {
      this.imageIndex = 0
    } else {
      this.imageIndex++;
    }
    this.updateImageSrc();
  }
}
