import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductRequired } from '../forms/product-screen/models/product.model';
import { FormControl, Validators } from '@angular/forms';
import { Color, ProductInfo, Size } from '../forms/product-screen/models/product-info.model';
import { ProductDetailService } from './services/product-detail.service';
import { CartService } from 'src/app/shared/cart/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerComponent } from 'src/app/shared/image-viewer/image-viewer.component';
import { ColorRequired } from '../forms/color-screen/models/color.model';
import { SizeRequired } from '../forms/size-screen/models/size.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail-screen',
  templateUrl: './product-detail-screen.component.html',
  styleUrls: ['./product-detail-screen.component.scss']
})
export class ProductDetailScreenComponent {
  product!: Product;
  productId: number = -1;

  color!: Color;
  colorId: number = -1;

  size!: SizeRequired;
  sizeId: number = -1;

  colors: ColorRequired[] = [];
  sizes: Size[] = [];

  quantities: number[] = [];
  quantity: number = 1;
  maxQuantity: number = 1;

  colorControl: FormControl = new FormControl('');
  sizeControl: FormControl = new FormControl('');
  quantityControl: FormControl = new FormControl(null);

  constructor(private router: Router,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private productDetailService: ProductDetailService,
              public cartService: CartService){
    let product: Product = this.router.getCurrentNavigation()?.extras.state?.['product'];

    console.log("cART SERVICE=> ", this.cartService)
    if(product) {
      this.product = product;
      if(this.product.productId){
        this.productId = this.product.productId;

        this.getProductColors();
      }
    }
    console.log("PRODUCT => ", product)
  }

  ngOnInit(): void {
    this.colorControl.valueChanges.subscribe( (color: ColorRequired) => {
      console.log("Color => ", color)
      if(color){
        this.color = color;
        this.sizeControl.setValue('', {emitEvent: false});
        if(this.color && this.color.colorId){
          this.colorId = this.color.colorId;
          this.getSizesOfProductByColor();
        }
      }
    });

    this.sizeControl.valueChanges.subscribe( (size: SizeRequired) => {
      this.size = size;
      console.log("Size => ", size)
      if(this.size && this.size.sizeId){
        this.sizeId = this.size.sizeId;
        this.getProductQuantByColorSize();
      }
    });

    this.quantityControl.valueChanges.subscribe( quantity => {
      this.quantity = quantity;
    });
  }

  getProductColors(){
    this.productDetailService.getColorsOfProduct(this.productId).subscribe({
      next: (response : ColorRequired[])=> {
        this.colors = response as ColorRequired[];
        console.log("Response => ", response)
      },
      error: (response)=> {
        console.log("Response ERRO => ", response)
      }
    });
  }

  getSizesOfProductByColor(){
    this.sizes = [];
    this.quantities = [];
    this.productDetailService.getSizesOfProductByColor(this.productId, this.colorId).subscribe({
      next: (response: SizeRequired[])=> {
        this.sizes = response as SizeRequired[];
        console.log("Response => ", response)
      }, error: (response)=> {
        console.log("Response ERRO => ", response)
      }
    })
  }

  getProductQuantByColorSize(){
    this.quantities = [];
    this.productDetailService.getProductQuantByColorSize(this.productId, this.colorId, this.sizeId).subscribe({
      next: (response: number)=> {
        this.maxQuantity = response;

        let quantities: number = response as number;
        for(let i = 1; i < quantities + 1; i++){
          this.quantities.push(i);
        }

        if(this.quantity > this.maxQuantity){
          this.quantityControl.setValue(this.maxQuantity);
        }
        console.log("Response => ", response)
      }, error: (response)=> {
        console.log("Response ERRO => ", response)
      }
    })
  }

  addToCart(){
    if(this.validateRequiredFields()){
      console.log("Adding =>")
      console.log("Get cart items => ", this.cartService.getCartItems())
/*
      const cartItens = this.cartService.getCartItems();

      const pInfoIndex = cartItens.findIndex((e) => e.product.productId === this.product.productId && e.color.colorId === this.color.colorId && e.size.sizeId === this.size.sizeId);

      if(pInfoIndex !== -1){
        cartItens[pInfoIndex].quantity += this.quantity;
      } else {*/
        const productInfo: ProductInfo = {
          product: this.product as ProductRequired,
          color: this.color,
          size: this.size,
          quantity: this.quantity
        }

        this.cartService.addToCart(productInfo);
      //}

      this._snackBar.open(`Produto '${this.product.productName}' adicionado ao carrinho.`, "Ok", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })
    } else {
      this._snackBar.open('Escolha o tamanho e informe a quantidade que deseja.', "Ok", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })    }

  }

  validateRequiredFields(): boolean{
    let valid: boolean = true;
    console.log(this.colorControl.value)
    console.log(this.sizeControl.value)
    console.log(this.quantityControl.value)


    if(this.colorControl.value == undefined || this.colorControl.value == ''){
      this.colorControl.setValidators(Validators.required);
      this.colorControl.setErrors(Validators.required);
      this.colorControl.markAsTouched();
      valid = false;
    }

    if(this.sizeControl.value == undefined || this.sizeControl.value == ''){
      this.sizeControl.setValidators(Validators.required);
      this.sizeControl.setErrors(Validators.required);
      this.sizeControl.markAsTouched();
      valid = false;
    }
/*
    if(this.quantityControl.value == undefined){
      this.quantityControl.setValidators(Validators.required);
      this.quantityControl.setErrors(Validators.required);
      this.quantityControl.markAsTouched();
      valid = false;
    }*/

    return valid;
  }

  openImageViewer(imagePath: string){
    this.dialog.open(ImageViewerComponent, {
      data: { imagePath },
    })
  }

  navigateToRoute(route: string){
    this.router.navigate([route], {skipLocationChange: true})
  }

  increment() {
    if(this.color && this.size){
      if(this.quantity < this.maxQuantity){
        this.quantity++;
      } else {
        this._snackBar.open(`Quantidade máxima do produto atingida.`, "Ok", {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        })
      }
    }
  }

  decrement() {
    if (this.quantity > 1)
      this.quantity--;
  }
}
