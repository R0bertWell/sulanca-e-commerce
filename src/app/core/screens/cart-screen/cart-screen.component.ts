import { Component } from '@angular/core';
import { ProductInfo } from '../forms/product-screen/models/product-info.model';
import { MatTableDataSource } from '@angular/material/table';
import { CartService } from 'src/app/shared/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-screen',
  templateUrl: './cart-screen.component.html',
  styleUrls: ['./cart-screen.component.scss']
})
export class CartScreenComponent {
  displayedColumns: string[] = ['product', 'color', 'size', 'quantity'];
  PRODUCT_INFO_DATA: ProductInfo[] = [];
  dataSource = new MatTableDataSource<ProductInfo>(this.PRODUCT_INFO_DATA);

  constructor(private router: Router,
              public cartService: CartService) {
    this.attCart();
  }

  removeFromCart(prodInfo: ProductInfo){
    this.cartService.removeItem(prodInfo);
    this.attCart();
  }

  attCart(){
    this.PRODUCT_INFO_DATA = this.cartService.getCartItems();
    this.dataSource = new MatTableDataSource<ProductInfo>(this.PRODUCT_INFO_DATA);
  }

  sendOrder(){
    const numeroDestino = '123456789';
    const mensagem = this.constructOrderMessage();

    const urlWhatsApp = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensagem)}`;
    console.log("Link =. ", urlWhatsApp)
    window.open(urlWhatsApp, '_blank');
  }

  constructOrderMessage(){
    let mensagem = 'Pedido:\n';
    let totalValue: number = 0;

    this.PRODUCT_INFO_DATA.forEach((item, index) => {
      mensagem += `${index + 1}. ${item.product.productName} - Cor : ${item.color.colorName} - Tamanho : ${item.size.sizeName} - Quantidade: ${item.quantity} - ValorTotal : ${item.quantity * item.product.productValue}\n`;
      totalValue += item.quantity * item.product.productValue;
    });



    mensagem += `\nTotal: R$ ${totalValue}`;

    return mensagem;
  }

}
