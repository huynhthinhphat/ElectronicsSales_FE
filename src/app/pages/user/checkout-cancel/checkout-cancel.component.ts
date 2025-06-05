import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/Order.model';
import { OrderService } from '../../../shared/services/OrderSerivce/order.service';

@Component({
  selector: 'app-checkout-cancel',
  standalone: false,
  templateUrl: './checkout-cancel.component.html',
  styleUrl: './checkout-cancel.component.css'
})
export class CheckoutCancelComponent implements OnInit {
  constructor(
    private orderService: OrderService
  ) { }

  seconds: number = 10;
  isCancel: boolean = false;

  ngOnInit(): void {
    const orderJson = localStorage.getItem('order');
    const order: Order | null = orderJson ? JSON.parse(orderJson) : null;

    if (order && order.orderCode) {
      order.status = 'PENDING';
      this.orderService.updateOrder(order!).subscribe({
        next: (res => {
          if (res && res.status === 'success') {
            this.isCancel = true;
            localStorage.removeItem('order');

            if (this.isCancel) {
              setInterval(() => {
                this.seconds -= 1;

                if (this.seconds === 0) {
                  location.href = "/home"
                }
              }, 1000)
            }
          }
        })
      })
    }
  }
}
