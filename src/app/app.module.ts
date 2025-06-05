import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutUserComponent } from './layout/layout-user/layout-user.component';
import { LayoutAdminComponent } from './layout/layout-admin/layout-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LeftpanelComponent } from './pages/user/leftpanel/leftpanel.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { CategoryManagementComponent } from './pages/admin/category-management/category-management.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { OrderManagementComponent } from './pages/admin/order-management/order-management.component';
import { ProductManagementComponent } from './pages/admin/product-management/product-management.component';
import { PageNotFoundComponent } from './shared/components/pagenotfound/page-not-found.component';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { AccountDetailsComponent } from './pages/user/account-details/account-details.component';
import { CartComponent } from './pages/user/cart/cart.component';
import { ChangePasswordComponent } from './pages/user/change-password/change-password.component';
import { CheckoutCancelComponent } from './pages/user/checkout-cancel/checkout-cancel.component';
import { CheckoutSuccessComponent } from './pages/user/checkout-success/checkout-success.component';
import { CheckoutComponent } from './pages/user/checkout/checkout.component';
import { ForgotPasswordComponent } from './pages/user/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/user/home/home.component';
import { OrderDetailsComponent } from './pages/user/order-details/order-details.component';
import { OrderComponent } from './pages/user/order/order.component';
import { ProductDetailsComponent } from './pages/user/product-details/product-details.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TrashProductManagementComponent } from './pages/admin/trash-product-management/trash-product-management.component';
import { AuthRedirectComponent } from './shared/components/auth-redirect/auth-redirect.component';
registerLocaleData(localeVi);
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ReviewComponent } from './pages/user/review/review.component';
import { ReviewManagementComponent } from './pages/admin/review-management/review-management.component';
import { loadingInterceptor } from './core/interceptor/loading.interceptor';
import { AccountManagementComponent } from './pages/admin/account-management/account-management.component';
import { BrandManagementComponent } from './pages/admin/brand-management/brand-management.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutUserComponent,
    LayoutAdminComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    PageNotFoundComponent,
    LeftpanelComponent,
    AccountDetailsComponent,
    ChangePasswordComponent,
    OrderDetailsComponent,
    ProductDetailsComponent,
    CheckoutComponent,
    CheckoutSuccessComponent,
    CheckoutCancelComponent,
    OrderComponent,
    CartComponent,
    AccountManagementComponent,
    BrandManagementComponent,
    CategoryManagementComponent,
    ProductManagementComponent,
    OrderManagementComponent,
    TrashProductManagementComponent,
    AuthRedirectComponent,
    ReviewComponent,
    ReviewManagementComponent
  ],
  imports: [
    FormsModule,
    AngularEditorModule,
    NgApexchartsModule,
    CanvasJSAngularChartsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    NgxImageZoomModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      timeOut: 2000,
      iconClasses: {
        success: 'toast-success',
        error: 'toast-error',
        info: 'toast-info',
        warning: 'toast-warning'
      },
      toastClass: 'ngx-toastr toast',
      newestOnTop: true
    }),
  ],
  providers: [
    provideHttpClient(withInterceptors([loadingInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
