import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Brand } from '../../../models/Brand.model';
import { Message } from '../../../models/Message.model';
import { Order } from '../../../models/Order.model';
import { OrderService } from '../../../shared/services/OrderSerivce/order.service';
import { Product } from '../../../models/Product.model';
import { ExcelService } from '../../../shared/services/ExcelServive/excel.service';

@Component({
  selector: 'app-order-management',
  standalone: false,
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent implements OnInit {
  constructor(
    private orderSerivce: OrderService,
    private toastr: ToastrService,
    private excelService: ExcelService
  ) { }

  orders: Order[] = [];
  products: Product[] = [];
  order: Order | null = null;
  page: number = 0;
  limit: number = 20;
  endRecord: number = 0;
  startRecord: number = 1;
  totalElement: number = 0;
  maxDay: string = '';
  startDay: string = '';
  endDay: string = '';
  status: string = '';
  keyWord: string = '';
  delivery: string = '';
  newStatus: string = '';
  transaction: string = '';
  isChange: boolean = false;
  isViewDetail: boolean = false;
  isShowDialogUpdate: boolean = false;

  ngOnInit(): void {
    this.initDate();
    this.viewOrders();
  }

  initDate(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const date = `${year}-${month}-${day}`;

    this.maxDay = date;
    this.endDay = date;
    this.startDay = `${year}-01-01`;
  }

  searchOrders() {
    this.keyWord = this.keyWord.trim();
    if (!this.keyWord) {
      return;
    } else {
      this.page = 0;
    }
    this.viewOrders();
  }

  viewOrders() {
    const recordStartIndex = this.page * this.limit + 1;
    if (recordStartIndex >= this.totalElement && this.totalElement !== 0) {
      this.page = 0;
    }

    this.orderSerivce.viewOrders(this.keyWord, this.page, this.limit, this.status, this.transaction, this.delivery, this.startDay, this.endDay).subscribe({
      next: (res => {
        if (res?.data) {
          const data = res?.data;
          if (data) {
            this.totalElement = data.pageInfo?.totalElements ?? 0;
            this.orders = data.items as Order[];

            this.startRecord = recordStartIndex > this.totalElement ? 1 : recordStartIndex;
            this.endRecord = Math.min(this.limit * (this.page + 1), this.totalElement);
          }
        }
      })
    })
  }

  viewOrderDetail(id: string) {
    this.orderSerivce.viewOrderDetails(id).subscribe({
      next: (res => {
        if (res) {
          this.order = res.data as Order;

          if (this.order) {
            this.isViewDetail = true;
          }
        }
      })
    })
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  prePage() {
    this.page--;
    this.viewOrders();
  }

  nextPage() {
    this.page++;
    this.viewOrders();
  }

  reset() {
    this.page = 0;
    this.keyWord = '';
    this.limit = 20;
    this.status = ''
    this.transaction = '';
    this.delivery = '';
    this.initDate();
    this.viewOrders();
  }

  closeViewDetail() {
    this.isViewDetail = false;
  }

  openDialogUpdate(order: Order) {
    this.order = order;
    this.isShowDialogUpdate = true;
    this.checkChangeStatus()
  }

  closeDialogUpdate() {
    this.newStatus = '';
    this.order = null;
    this.isShowDialogUpdate = false;
  }

  checkChangeStatus() {
    if (this.newStatus !== "" && this.newStatus !== this.order?.status) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  update() {
    if (this.order) {
      let orderUpdate: Order = {
        ...this.order,
        status: this.newStatus
      }

      this.orderSerivce.updateOrder(orderUpdate).subscribe({
        next: (res) => {
          if (res && res.status === 'success') {
            this.toastr.success(res.message);
          } else {
            this.toastr.error(res.message || 'Cập nhật thất bại!');
          }
        },
        error: (err) => {
          this.toastr.error('Có lỗi xảy ra khi cập nhật đơn hàng!');
        },
        complete: () => {
          this.order!.status = this.newStatus;
          this.newStatus = '';
          this.closeDialogUpdate();
        }
      });
    }
  }

  exportExcel() {
    this.excelService.exportOrdersToExcel(this.keyWord, this.page, this.limit, this.status, this.transaction, this.delivery, this.startDay, this.endDay).subscribe(blob => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'orders.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Lỗi tải file Excel:', error);
    });
  }
}
