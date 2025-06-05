import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/OrderSerivce/order.service';
import { Order } from '../../../models/Order.model';
import { Product } from '../../../models/Product.model';
import { CartService } from '../../../shared/services/CartService/cart.service';
import { Account } from '../../../models/Account.model';

@Component({
  selector: 'app-checkout-success',
  standalone: false,
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css'
})
export class CheckoutSuccessComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private router: Router,
    private cartService: CartService
  ) { }

  orderId: string = '';
  orderCode: string = '';
  totalPrice: number = 0;
  products: Product[] = [];
  isSuccess: boolean = false;

  ngOnInit() {
    this.isValidRedirect();
  }

  isValidRedirect() {
    const orderJson = localStorage.getItem('order');
    const order: Order | null = orderJson ? JSON.parse(orderJson) : null;
    this.orderId = order?.id as string;

    if (order) {
      this.checkExistOrderCode();
    }

    this.products = order?.items as Product[];
    this.totalPrice = order?.totalPrice as number;
  }

  checkExistOrderCode() {
    if (this.orderId) {
      this.orderService.viewOrderDetails(this.orderId).subscribe({
        next: (res) => {
          if (res) {
            if (res.status === 'success') {
              const order = localStorage.getItem('order');

              if (order) {
                this.cartService.updateTotalQuantityOfCart(JSON.parse(order).totalQuantity);
                this.isSuccess = true;
                return;
              }
            }
            location.href = '/404';
          }
        }
      })
    }
  }

  goToHome() {
    location.href = '/home';
  }

  goToOrderDetail() {
    this.router.navigate(['/user/orders/detail'], {
      queryParams: { id: this.orderId },
      state: { isValidRedirect: true }
    });
  }
}
