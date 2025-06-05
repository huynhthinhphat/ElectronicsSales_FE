import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Message } from '../../../models/Message.model';
import { Order } from '../../../models/Order.model';
import { OrderService } from '../../../shared/services/OrderSerivce/order.service';

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  reasonReturned: string = '';
  differenceReasson: string = '';
  selectedReason: string = 'Muốn thay đổi địa chỉ giao hàng';
  statusIndex: number = 0;
  isShowDialogAccept: boolean = false;
  isShowDialogReturned: boolean = false;
  inputDifferenceReason: boolean = false;
  isShowDialogCompleted: boolean = false;
  order: Order | undefined;
  statusList: string[] = ['PENDING', 'SHIPPING', 'COMPLETED', 'CANCELED', 'RETURNING', 'REFUNDED'];

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParams['id'];
    this.viewOrderDetails(orderId);
  }

  viewOrderDetails(orderId: string) {
    this.orderService.viewOrderDetails(orderId).subscribe({
      next: (res => {
        if (res && res.data) {
          this.order = res.data as Order;

          if (this.order) {
            if (this.order.status) {
              const index = this.statusList.indexOf(this.order.status);
              this.statusIndex = index;
            }
          }
        }
      })
    })
  }

  goToOrder() {
    this.router.navigate(['user/orders'], {
      state: { isValidRedirect: true }
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  showOrHiddenDiaglogAccept() {
    this.isShowDialogAccept = !this.isShowDialogAccept;
  }

  showOrHiddenDiaglogCompleted() {
    this.isShowDialogCompleted = !this.isShowDialogCompleted;
  }

  showOrHiddenDiaglogReturned() {
    this.isShowDialogReturned = !this.isShowDialogReturned;
  }

  stopClickPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  onReasonChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedReason = selectedValue;
    if (selectedValue === 'Lý do khác: ') {
      this.inputDifferenceReason = true;
    } else {
      this.inputDifferenceReason = false;
      this.differenceReasson = '';
    }
  }

  onInputChange(event: any) {
    this.differenceReasson = event.target.value;
  }

  toggleOrder(index: number) {
    if (!this.order) return;

    this.order.status = this.statusList[index];
    if (index === 3) {
      this.order.note = this.selectedReason + this.differenceReasson;
    } else if (index === 4) {
      this.order.note = this.selectedReason + this.reasonReturned;
    }
    this.orderService.updateOrder(this.order!).subscribe({
      next: (res => {
        if (res && res.status === 'success') {
          if (index === 3) {
            this.toastr.success(Message.SUCCESS_CANCEL_FOR_ORDER);
          } else if (index === 2) {
            this.toastr.success(Message.THANK_YOU_FOR_PURCHASE);
          } else if (index === 4) {
            this.toastr.success(Message.SUCCESS_RETURNING_FOR_ORDER);
          }
        }
      }),
      complete: () => {
        this.statusIndex = index;

        if (index === 3) {
          this.isShowDialogAccept = false;
          return;
        } else if (index === 2) {
          this.isShowDialogCompleted = false;
          return;
        } else if (index === 4) {
          this.isShowDialogReturned = false;
          return;
        }
      }
    })
  }

  reviewProduct(id: string) {
    this.router.navigate(['/review'], {
      queryParams: { id: id },
      state: { isValidRedirect: true }
    });
  }
}
