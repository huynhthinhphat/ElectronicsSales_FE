import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../../../shared/services/CartService/cart.service';
import { CartItem } from '../../../models/CartItem.model';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../../shared/services/LeaveCheck/leave-check.guard';
import { Product } from '../../../models/Product.model';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, CanComponentDeactivate {
  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  cartItem: CartItem[] = [];
  selectedItems: string[] = [];
  totalPrice: number = 0;
  selectedItemId: string | null = null;
  isUpdate: boolean = false;
  isPayment: boolean = false;
  isChecked: boolean = false;
  isShowToDelete: boolean = false;

  ngOnInit(): void {
    this.viewItemsInCart();
  }

  async canDeactivate(): Promise<boolean> {
    if (this.cartItem.length > 0 && this.isUpdate) {
      const confirmLeave = confirm('Bạn có chắc chắn muốn rời khỏi trang? Chọn OK để lưu và chọn Hủy để không lưu!');
      if (!confirmLeave) return false;

      const deleteResult = await this.deleteItemsSelected(this.getZeroItemIds());
      const updateResult = await this.updateItemsInCart();

      return deleteResult && updateResult;
    }

    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    if (this.isUpdate && this.cartItem.length > 0) {
      this.deleteItemsSelected(this.getZeroItemIds());
      this.cartService.syncCartOnUnload(this.cartItem);
    }
  }

  private getZeroItemIds(): string[] {
    return this.cartItem.filter(item => item.quantity === 0).map(item => item.id!);
  }

  trackById(index: number, item: CartItem): string {
    return item.id!;
  }

  viewItemsInCart() {
    this.cartService.viewItemsInCart().subscribe({
      next: (res => {
        if (res) {
          this.cartItem = res.data as CartItem[];
        }
      })
    })
  }

  goToProductDetail(index: number) {
    if (!this.cartItem[index].isDeleted) {
      this.router.navigate(['/product-details'], {
        queryParams: { id: this.cartItem[index].productId }
      });
    }
  }

  decreaseQuantity(index: number) {
    if (this.cartItem[index].quantity! > 0) {
      this.cartItem[index].quantity!--;
      this.cartItem[index].totalPrice! -= this.cartItem[index].price!;
    }

    this.isUpdate = true;
  }

  increaseQuantity(index: number) {
    this.cartItem[index].quantity!++;
    this.cartItem[index].totalPrice! += this.cartItem[index].price!;
    this.isUpdate = true;
  }

  onInputChange(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    if (value >= 0) {
      this.cartItem[index].quantity = value;
      this.isUpdate = true;
    }
  }

  onBlur(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    if (isNaN(value) || value < 0) {
      target.value = String(this.cartItem[index].quantity || 0);
    }
  }

  toggleItemSelection(id: string, event: Event): void {
    event.stopPropagation();
    this.behaviourWithItemSelection(id, this.selectedItems);
  }

  behaviourWithItemSelection(id: string, arr: string[]) {
    const index = arr.indexOf(id);
    if (index === -1) {
      arr.push(id);
    } else {
      arr.splice(index, 1);
    }
    this.updateSelectedTotalPrice();
  }

  addAllToSelectedItems(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;

    if (this.isChecked) {
      this.selectedItems = this.cartItem.filter(item => !item.isDeleted).map(item => item.id!);
    } else {
      this.selectedItems = [];
    }
    this.updateSelectedTotalPrice();
  }

  updateSelectedTotalPrice() {
    this.totalPrice = this.cartItem
      .filter(item => this.selectedItems.includes(item.id!))
      .reduce((sum, item) => sum + item.totalPrice!, 0);

    if (this.totalPrice > 0) {
      this.isPayment = true;
    } else {
      this.isPayment = false;
    }
  }

  isItemSelected(item: CartItem): boolean {
    return this.selectedItems.includes(item.id!);
  }

  showDiaLog(id: string | null) {
    this.isShowToDelete = !this.isShowToDelete;
    if (id !== null) {
      this.selectedItemId = id;
    } else {
      this.selectedItemId = null;
    }
  }

  async deleteItemsSelected(arr: string[] | null): Promise<boolean> {
    let listToDelete: string[] = arr ?? (this.selectedItemId ? [this.selectedItemId] : [...this.selectedItems]);

    // if (this.selectedItemId) {
    //   this.behaviourWithItemSelection(this.selectedItemId, this.selectedItems);
    // }

    try {
      const res = await this.cartService.deleteItemsInCart(listToDelete).toPromise();
      if (res?.status === 'success') {
        this.cartService.updateTotalQuantityOfCart(res.data.totalQuantity);

        this.cartItem = this.cartItem.filter(item => !listToDelete.includes(item.id!));
        this.selectedItems = this.selectedItems.filter(itemId => !listToDelete.includes(itemId));

        this.totalPrice = this.cartItem.reduce((sum, item) => sum + item.totalPrice!, 0);
        this.isShowToDelete = false;
        return true;
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  }

  async updateItemsInCart(): Promise<boolean> {
    try {
      if (this.cartItem.length === 0) return true;

      const payload: CartItem[] = this.cartItem.map(item => ({
        id: item.productId,
        quantity: item.quantity,
        color: item.color
      }));

      const res = await this.cartService.updateItemsInCart(payload).toPromise();
      return res?.status === 'success';
    } catch {
      return false;
    }
  }

  buyNow() {
    const selectedSet = new Set(this.selectedItems);
    const data: Product[] = this.cartItem
      .filter(item => selectedSet.has(item.id!))
      .map(item => ({ ...item, priceAtTime: item.price, id: item.productId }));

    const productList = localStorage.getItem('productList');
    if (productList) {
      localStorage.removeItem('productList');
    }
    localStorage.setItem('productList', JSON.stringify(data));
    this.router.navigate(['/checkout'], {
      state: { isValidRedirect: true, isFromCart: true }
    });
  }
}
