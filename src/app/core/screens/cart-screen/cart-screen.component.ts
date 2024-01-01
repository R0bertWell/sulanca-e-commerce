import { Component, Input } from '@angular/core';
import { ProductInfo } from '../forms/product-screen/models/product-info.model';
import { MatTableDataSource } from '@angular/material/table';
import { CartService } from 'src/app/shared/cart/cart.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/environment';
import { Payment } from './models/payment.model';
import { PaymentResponse } from '../payment-screen/models/payment_response.model';
import { MatSidenav } from '@angular/material/sidenav';
import { GlobalVariablesService } from 'src/app/shared/services/global/global-variables.service';
import { Config } from 'src/app/shared/models/config.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { Cart } from './models/client-order.model';
import { OrderService } from './services/order.service';

@Component({
  selector: 'app-cart-screen',
  templateUrl: './cart-screen.component.html',
  styleUrls: ['./cart-screen.component.scss']
})
export class CartScreenComponent {
  @Input() sidenav!: MatSidenav;
  displayedColumns: string[] = ['product', 'color', 'size', 'quantity'];
  PRODUCT_INFO_DATA: ProductInfo[] = [];
  dataSource = new MatTableDataSource<ProductInfo>(this.PRODUCT_INFO_DATA);
  totalValue: number = 0;
  message: string = '';

  cartIsEmpty: boolean = true;

  excursionControl: FormControl = new FormControl('', [Validators.required]);
  excursionName: string = '';

  config!: Config;
  snWhatsapp: boolean = true;

  constructor(private router: Router,
              private dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private http: HttpClient,
              public cartService: CartService,
              private orderService: OrderService,
              private globalService: GlobalVariablesService) {
                console.log("Entro uno carrinho")
    this.attCart();
    this.setConfigs();
  }

  ngOnInit(): void {
    this.excursionControl.valueChanges.subscribe((value: string)=> {
      if(value){
        this.excursionName = value;
      }
    })
  }

  setConfigs(){
    this.globalService.getConfig().subscribe({
      next: (response: Config)=> {
        this.config = response as Config;
        console.log("Config => ", this.config);
      },
      error: (error: any)=> {

      }
    });
  }

  removeFromCart(prodInfo: ProductInfo){
    this.cartService.removeItem(prodInfo);
    this.attCart();
  }

  attCart(){
    console.log("Att cart =>")
    this.PRODUCT_INFO_DATA = this.cartService.getCartItems();

    if(this.PRODUCT_INFO_DATA.length > 0){
      this.cartIsEmpty = false;
    }
    this.dataSource = new MatTableDataSource<ProductInfo>(this.PRODUCT_INFO_DATA);
    this.message = this.constructOrderMessage();
  }

  sendOrder(){
    if(this.excursionName == null || (this.excursionName != null && (this.excursionName == '' || this.excursionName.trim() == ''))){
      this._snackBar.open("Informe a excursão que seu pedido será enviado", "Ok", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })
      this.excursionControl.setValue('', {emitEvent: false});
      this.excursionControl.setErrors(Validators.required);
      this.excursionControl.markAsTouched();
    } else {
      let dialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: `Deseja enviar o seu pedido? \n ${this.message}`
        }
      })

      dialog.afterClosed().subscribe(result => {
        if(result){
          if(this.cartIsEmpty){
            this._snackBar.open("O carrinho está vazio.", "Ok", {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            })
          } else {
            const cart: Cart = {
              excursion: this.excursionName,
              orderDate: new Date(),
              totalValue: this.totalValue,
              payed: false,
              items: this.PRODUCT_INFO_DATA
            }

            this.orderService.saveOrder(cart).subscribe({
              next: (response: any)=> {
                if(this.config.snWhatsapp){
                  this.sendWhatsappOrder();
                } else {
                  this.generatePayment();
                }
                console.log("Response =>", response)
              },
              error: (error: string)=> {
                console.log("Error => ", error)
              }
            });
          }
        }
      })
    }
  }

  constructOrderMessage(){
    let mensagem = 'Pedido:\n';
    let totalValue: number = 0;

    this.PRODUCT_INFO_DATA.forEach((item, index) => {
      mensagem += `${index + 1}. ${item.product.productName} - Cor : ${item.color.colorName} - Tamanho : ${item.size.sizeName} - Quantidade: ${item.quantity} - ValorTotal : ${item.quantity * item.product.productValue}\n`;
      totalValue += item.quantity * item.product.productValue;
    });


    this.totalValue = totalValue;
    mensagem += `\nTotal: R$ ${totalValue}`;
    console.log("Total value => ", this.totalValue)
    console.log("message => ", this.message)
    return mensagem;
  }

  generatePayment(){
    const payment: Payment = {
      transaction_amount: this.totalValue,
      description: "Roupas D+ UM LOOK : " + this.message,
      payment_method_id: "pix",
      payer: {
        first_name: "Cliente",
        last_name: "Pagador",
        email: "teste@teste.com",
        identification: {
          type: "CPF",
          number: "43854786000"
        },
        address: undefined
      }
    }

    /*payerLastName: "Pagador",
    email: "luciano_gato92@hotmail.com",
    identificationType: "CPF",
    identificationNumber: "70466581459",
    transactionAmount: this.totalValue,
    description: "Roupas D+ um look"*/
    this.http.post<PaymentResponse>(environment.PATH_API + '/process_payment', payment).subscribe({
      next: (payment: PaymentResponse) =>{
        console.log("Payment => ", payment)
        this.router.navigate(['/payment'], {skipLocationChange: true, state: {payment}});
        this.closeNav();
      },
      error: (error: any) => {
        console.log("eRROR => ", error)
      }
    })
  }

  sendWhatsappOrder(){
    const numeroDestino = this.config.whatsappNumber;
    const urlWhatsApp = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(this.message)}`;
    console.log("Link =. ", urlWhatsApp)
    window.open(urlWhatsApp, '_blank');
  }

  closeNav(){
    this.sidenav.close();
  }

  cleanCart() {
    this.cartService.removeAll();
    this.attCart();
  }
}
