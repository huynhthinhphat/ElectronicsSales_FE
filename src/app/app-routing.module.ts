import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutUserComponent } from './layout/layout-user/layout-user.component';
import { LayoutAdminComponent } from './layout/layout-admin/layout-admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/components/pagenotfound/page-not-found.component';
import { LeftpanelComponent } from './pages/user/leftpanel/leftpanel.component';
import { CheckoutSuccessComponent } from './pages/user/checkout-success/checkout-success.component';
import { CartComponent } from './pages/user/cart/cart.component';
import { LeaveCheckGuard } from './shared/services/LeaveCheck/leave-check.guard';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { AccountDetailsComponent } from './pages/user/account-details/account-details.component';
import { ChangePasswordComponent } from './pages/user/change-password/change-password.component';
import { CheckoutCancelComponent } from './pages/user/checkout-cancel/checkout-cancel.component';
import { CheckoutComponent } from './pages/user/checkout/checkout.component';
import { ForgotPasswordComponent } from './pages/user/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/user/home/home.component';
import { OrderDetailsComponent } from './pages/user/order-details/order-details.component';
import { OrderComponent } from './pages/user/order/order.component';
import { ProductDetailsComponent } from './pages/user/product-details/product-details.component';
import { CategoryManagementComponent } from './pages/admin/category-management/category-management.component';
import { ProductManagementComponent } from './pages/admin/product-management/product-management.component';
import { OrderManagementComponent } from './pages/admin/order-management/order-management.component';
import { TrashProductManagementComponent } from './pages/admin/trash-product-management/trash-product-management.component';
import { AuthRedirectComponent } from './shared/components/auth-redirect/auth-redirect.component';
import { ReviewComponent } from './pages/user/review/review.component';
import { ReviewManagementComponent } from './pages/admin/review-management/review-management.component';
import { CheckoutGuardService } from './core/guards/CheckoutGuard/checkout-guard.service';
import { AccountManagementComponent } from './pages/admin/account-management/account-management.component';
import { BrandManagementComponent } from './pages/admin/brand-management/brand-management.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: AuthRedirectComponent },
  {
    path: 'admin', component: LayoutAdminComponent,
    children: [
      { path: 'admin', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'accounts', component: AccountManagementComponent },
      { path: 'categories', component: CategoryManagementComponent },
      { path: 'brands', component: BrandManagementComponent },
      { path: 'products', component: ProductManagementComponent },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'comments', component: ReviewManagementComponent },
      { path: 'trash', component: TrashProductManagementComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  {
    path: '', component: LayoutUserComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'product-details', component: ProductDetailsComponent },
      { path: 'checkout', component: CheckoutComponent, canActivate: [CheckoutGuardService] },
      { path: 'checkout/success', component: CheckoutSuccessComponent },
      { path: 'checkout/cancel', component: CheckoutCancelComponent, canActivate: [CheckoutGuardService] },
      { path: 'cart', component: CartComponent, canActivate: [CheckoutGuardService], canDeactivate: [LeaveCheckGuard] },
      {
        path: 'user', component: LeftpanelComponent,
        children: [
          { path: 'infor', component: AccountDetailsComponent, canActivate: [CheckoutGuardService] },
          { path: 'orders', component: OrderComponent, canActivate: [CheckoutGuardService] },
          { path: 'orders/detail', component: OrderDetailsComponent, canActivate: [CheckoutGuardService] },
        ]
      },
      { path: 'review', component: ReviewComponent, canActivate: [CheckoutGuardService] },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
