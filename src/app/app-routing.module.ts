import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListScreenComponent } from './core/screens/product-list-screen/product-list-screen.component';
import { ProductScreenComponent } from './core/screens/forms/product-screen/product-screen.component';
import { ProductDetailScreenComponent } from './core/screens/product-detail-screen/product-detail-screen.component';
import { CartScreenComponent } from './core/screens/cart-screen/cart-screen.component';
import { ColorScreenComponent } from './core/screens/forms/color-screen/color-screen.component';
import { SizeScreenComponent } from './core/screens/forms/size-screen/size-screen.component';
import { CategoryScreenComponent } from './core/screens/forms/category-screen/category-screen.component';

const routes: Routes = [
  { path: 'product-list', component: ProductListScreenComponent},
  { path: 'cart', component: CartScreenComponent},
  { path: 'colors', component: ColorScreenComponent},
  { path: 'sizes', component: SizeScreenComponent},
  { path: 'categories', component: CategoryScreenComponent},
  { path: 'product-detail', component: ProductDetailScreenComponent},
  { path: 'add-product', component: ProductScreenComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
