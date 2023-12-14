import { Injectable } from '@angular/core';
import { Cart } from './models/cart.model';
import { ProductInfo } from 'src/app/core/screens/forms/product-screen/models/product-info.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: ProductInfo[] = [];

  constructor(public _snackBar: MatSnackBar) {
    const storeCart = localStorage.getItem('cart');
    if(storeCart) {
      this.cartItems = JSON.parse(storeCart) as ProductInfo[];
    }
  }

  addToCart(item: ProductInfo) {

    const pInfoIndex = this.getCartItems().findIndex((e) =>
      e.product.productId === item.product.productId
      && e.color.colorId === item.color.colorId
      && e.size.sizeId === item.size.sizeId
    );

    if(pInfoIndex !== -1){
      this.cartItems[pInfoIndex].quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }

    this.saveCartToLocalStorage();
    this._snackBar.open(`Produto '${item.product.productName}' adicionado ao carrinho.`, "Ok", {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    })
  }

  removeItem(item: ProductInfo){
    const pInfoIndex = this.getCartItems().findIndex((e) =>
      e.product.productId === item.product.productId
      && e.color.colorId === item.color.colorId
      && e.size.sizeId === item.size.sizeId
    );

    if(pInfoIndex !== -1){
      this.cartItems.splice(pInfoIndex, 1);
    }
  }

  getCartItems() {
    return this.cartItems;
  }

  private saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // Outros métodos necessários para gerenciar o carrinho
}
