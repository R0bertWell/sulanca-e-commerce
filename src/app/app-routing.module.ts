import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListScreenComponent } from './core/screens/product-list-screen/product-list-screen.component';
import { ProductScreenComponent } from './core/screens/forms/product-screen/product-screen.component';
import { ProductDetailScreenComponent } from './core/screens/product-detail-screen/product-detail-screen.component';
import { CartScreenComponent } from './core/screens/cart-screen/cart-screen.component';
import { ColorScreenComponent } from './core/screens/forms/color-screen/color-screen.component';
import { SizeScreenComponent } from './core/screens/forms/size-screen/size-screen.component';
import { CategoryScreenComponent } from './core/screens/forms/category-screen/category-screen.component';
import { LoginScreenComponent } from './core/screens/login-screen/login-screen.component';
import { authGuard } from './auth/auth.guard';
import { DashboardScreenComponent } from './core/screens/dashboard-screen/dashboard-screen.component';
import { ConfigScreenComponent } from './core/screens/config-screen/config-screen.component';
import { PaymentScreenComponent } from './core/screens/payment-screen/payment-screen.component';

const routes: Routes = [
  { path: 'product-list', component: ProductListScreenComponent },
  { path: 'product-detail', component: ProductDetailScreenComponent },
  { path: 'cart', component: CartScreenComponent },
  { path: 'colors', component: ColorScreenComponent, canActivate: [authGuard] },
  { path: 'sizes', component: SizeScreenComponent, canActivate: [authGuard] },
  { path: 'categories', component: CategoryScreenComponent, canActivate: [authGuard] },
  { path: 'add-product', component: ProductScreenComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardScreenComponent, canActivate: [authGuard] },
  { path: 'config', component: ConfigScreenComponent, canActivate: [authGuard] },
  { path: 'payment', component: PaymentScreenComponent},
  { path: 'login', component: LoginScreenComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
