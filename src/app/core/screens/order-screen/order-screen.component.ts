import { OrderService } from './../cart-screen/services/order.service';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Cart, RequiredCart } from '../cart-screen/models/client-order.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-screen',
  templateUrl: './order-screen.component.html',
  styleUrls: ['./order-screen.component.scss']
})
export class OrderScreenComponent {
  CART_DATA: Cart[] = [];
  dataSourceCarts: MatTableDataSource<Cart> = new MatTableDataSource<Cart>(this.CART_DATA);

  filter: string = '';

  pageHandlerCart = {
    totalSize: 0,
    pageIndex: 0,
    pageSize: 10,
    options: [10,25,100]
  }

  displayedCartColumns: string[] = ["cartId", "excursion", "orderDate", "payed", "payedDate", "sent", "sentDate", "totalValue"];

  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private orderService: OrderService
  ){
    this.getOrders();
  }

  handlePageCart(event: any){
    this.pageHandlerCart.pageIndex = event.pageIndex;
    this.pageHandlerCart.pageSize = event.pageSize;
    this.getOrders();
  }

  getOrders(){
    this.orderService.getOrders(this.pageHandlerCart.pageIndex, this.pageHandlerCart.pageSize).subscribe({
      next: (response: any) => {
        this.CART_DATA = response.content as Cart[];

        this.dataSourceCarts = new MatTableDataSource<Cart>(this.CART_DATA);

        this.pageHandlerCart.totalSize = response.totalElements;
        this.pageHandlerCart.pageIndex = response.pageable.pageNumber;
        this.pageHandlerCart.pageSize = response.pageable.pageSize;
        console.log("Response => ", response)
      },
      error: (error: string) => {
        console.log("Error => ", error)
      }
    });
  }

  setPayedOrder(cart: RequiredCart){
    this.orderService.updatePayedOrder(cart.cartId, cart.payed).subscribe({
      next: (response: any)=> {
        this.getOrders();
        console.log("Saved payed order => ", response)
      },
      error: (error: string)=> {
        console.log("ERROR ", error)
      }
    })
  }

  setSentOrder(cart: RequiredCart){
    this.orderService.updateSentOrder(cart.cartId, cart.sent).subscribe({
      next: (response: any)=> {
        this.getOrders();
        console.log("Saved payed order => ", response)
      },
      error: (error: string)=> {
        console.log("ERROR ", error)
      }
    })
  }

}
