import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response as ApiResponse } from '../../../models/Response.model';
import { Cart } from '../../../models/Cart.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../../../models/Account.model';
import { CartItem } from '../../../models/CartItem.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private BASE_URL = environment.apiUrl + '/api/carts';
  private totalQuantity = new BehaviorSubject<number>(0);
  updateTotalQuantity$ = this.totalQuantity.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  updateTotalQuantityOfCart(totalQuantity: number) {
    const userStr = localStorage.getItem("user");
    const user: Account = userStr ? JSON.parse(userStr) : null;

    if (user) {
      user.totalQuantity = totalQuantity;
      localStorage.setItem("user", JSON.stringify(user));
    }
    this.totalQuantity.next(totalQuantity);
  }

  addItemsToCart(data: { id: string, quantity: number, color: string }): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.BASE_URL}`, data, { withCredentials: true });
  }

  viewItemsInCart(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}`, { withCredentials: true });
  }

  deleteItemsInCart(items: string[]): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.BASE_URL, { body: { items }, withCredentials: true });
  }

  updateItemsInCart(items: CartItem[]): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(this.BASE_URL, items, { withCredentials: true });
  }

  syncCartOnUnload(cartItems: CartItem[]) {
    const payload = cartItems.map(item => ({
      id: item.productId,
      quantity: item.quantity,
      color: item.color
    }));

    try {
      fetch(this.BASE_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include',
        keepalive: true
      });
    } catch (error) {
      console.error('Sync cart on unload failed:', error);
    }
  }
}
