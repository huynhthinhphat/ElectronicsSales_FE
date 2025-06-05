import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Order } from '../../../models/Order.model';
import { SignatureService } from '../../../shared/services/SignatureService/signature-service.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuardService implements CanActivate {
  constructor(
    private router: Router,
    private signatureService: SignatureService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url;
    const query = route.queryParams;

    if (url.startsWith('/user/orders')) {
      return this.isValidRedirect() || this.rejectAndRedirect();
    }

    if (url.startsWith('/checkout/cancel')) {
      return this.handleCheckoutCancel(query) || this.rejectAndRedirect();
    }

    if (url.startsWith('/checkout/success')) {
      return this.handleCheckoutSuccess(query) || this.rejectAndRedirect();
    }

    if (url.startsWith('/checkout')) {
      return this.isValidRedirect() || this.rejectAndRedirect();
    }

    if (url.startsWith('/user/infor')) {
      return (this.isValidRedirect() && !!localStorage.getItem('user')) || this.rejectAndRedirect();
    }

    if (url.startsWith('/cart')) {
      return (this.isValidRedirect() && !!query['id']) || this.rejectAndRedirect();
    }

    if (url.startsWith('/review')) {
      return this.isValidRedirectForReview(query['id']) || this.rejectAndRedirect();
    }

    return this.rejectAndRedirect();
  }

  private handleCheckoutCancel(query: any): boolean {
    const signature = query['signature'];
    const orderJson = localStorage.getItem('order');
    const order: Order | null = orderJson ? JSON.parse(orderJson) : null;

    return !!(signature && order?.orderCode && this.signatureService.verifySignature(order.orderCode, signature));
  }

  private handleCheckoutSuccess(query: any): boolean {
    const paymentMethod = query['paymentMethod'];
    const hasOrder = !!localStorage.getItem('order');

    if (!paymentMethod || !hasOrder) return false;

    if (paymentMethod === 'COD') {
      return this.isValidRedirect();
    }

    if (paymentMethod === 'MOMO') {
      return true;
    }

    return false;
  }

  private isValidRedirect(): boolean {
    const nav = this.router.getCurrentNavigation();
    const navState = nav?.extras.state;

    if (navState?.['isValidRedirect'] === true) {
      return true;
    }

    return false;
  }

  private isValidRedirectForReview(id: string): boolean {
    const nav = this.router.getCurrentNavigation();
    const navState = nav?.extras.state;

    if (navState?.['isValidRedirect'] === true && id) {
      return true;
    }

    return false;
  }

  private rejectAndRedirect(): boolean {
    this.router.navigate(['/404']);
    return false;
  }
}
