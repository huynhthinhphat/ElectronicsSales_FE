import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../../models/Account.model';
import { Order } from '../../../models/Order.model';
import { OrderService } from '../../../shared/services/OrderSerivce/order.service';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  orders: Order[] = [];
  status: string = '';
  search: string = '';
  endDay: string = '';

  ngOnInit(): void {
    this.initDate();
    const user = localStorage.getItem('user');
    if (user) {
      const userJson: Account = JSON.parse(user);

      if (userJson) {
        this.viewOrders(this.status);
      }
    }
  }

  initDate(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    this.endDay = `${year}-${month}-${day}`;
  }

  viewOrders(status: string) {
    this.status = status;
    this.orderService.viewOrders(this.search, 0, 0, status, '', '', '2025-01-01', this.endDay).subscribe({
      next: (res => {
        if (res) {
          this.orders = res.data.items as Order[];
        }
      })
    })
  }

  onSearchSubmit(event: Event) {
    event.preventDefault();
    this.viewOrders(this.status);
  }

  goToOrderDetail(id: string) {
    this.router.navigate(['/user/orders/detail'], {
      queryParams: { id: id },
      state: { isValidRedirect: true }
    });
  }

  stopClickPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
}
