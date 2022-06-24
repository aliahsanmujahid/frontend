import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShopComponent } from './shop/shop.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HasRoleDirective } from './_directives/has-role.directive';
import { AdminComponent } from './admin/admin.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { AddeditproductComponent } from './components/addeditproduct/addeditproduct.component';
import { ProductComponent } from './components/product/product.component';
import { SingleComponent } from './components/single/single.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProfileComponent } from './components/profile/profile.component';
import { OrderComponent } from './components/order/order.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { SellersComponent } from './components/sellers/sellers.component';
import { DistrictComponent } from './components/district/district.component';
import { CategoryComponent } from './components/category/category.component';
import { RolesComponent } from './components/roles/roles.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthComponent } from './components/auth/auth.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { AdminloginComponent } from './components/adminlogin/adminlogin.component';

@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    HasRoleDirective,
    AdminComponent,
    AddeditproductComponent,
    ProductComponent,
    SingleComponent,
    CheckoutComponent,
    ProfileComponent,
    OrderComponent,
    HomeComponent,
    ErrorComponent,
    SellersComponent,
    DistrictComponent,
    CategoryComponent,
    RolesComponent,
    AuthComponent,
    AdminloginComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    NgxSpinnerModule,
    ColorPickerModule,
    InfiniteScrollModule,
    ToastrModule.forRoot(),
    SocialLoginModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},  
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '669351671073-ae83o151l8seg7pr0s8rdsvicgbjk3fn.apps.googleusercontent.com'
            )
          }
        ],
        multi: true
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
