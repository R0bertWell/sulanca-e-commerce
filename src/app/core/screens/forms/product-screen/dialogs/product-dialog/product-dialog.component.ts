import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Product, ProductImage, ProductImageRequired, ProductRequired } from '../../models/product.model';
import { FormControl, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';
import { Category } from '../../models/category.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProductScreenService } from '../../services/product-screen.service';
import { Color, ProductInfo, Size } from '../../models/product-info.model';
import { MatTableDataSource } from '@angular/material/table';
import { ProductDetailService } from 'src/app/core/screens/product-detail-screen/services/product-detail.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Image {
  productImageId: number;
  file: File | null,
  label: string,
  url: string,
  isMain: boolean
}

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  @ViewChild("chipGridCategory") chipGridCategory: any;

  categoryCtrl = new FormControl('');

  categoryOptions: Category[] = [];
  selectedCategories: Category[] = [];
  filteredCategoryOptions!: Observable<Category[]>;

  productId!: number;

  productNameControl: FormControl = new FormControl('')
  productDescControl: FormControl = new FormControl('')
  productValueControl: FormControl = new FormControl(0)
  inStockControl: FormControl = new FormControl(true)

  colorControl: FormControl = new FormControl('');
  sizeControl: FormControl = new FormControl('');
  quantityControl: FormControl = new FormControl(0);

  selectedColorInfo!: Color;
  selectedSizeInfo!: Size;
  selectedQuantityInfo!: number;

  colors: Color[] = [];
  sizes: Size[] = [];

  selectedImage: File | null = null;
  mainImage?: Image;

  currentImageIndex: number = 0;

  secondaryImages: Image[] = [];

  imagesToSave: ProductImage[] = [];
  imagesToDelete: number[] = [];

  newImageUrl: string = '';


  productInfos: ProductInfo[] = [];
  dataSourceProductInfos = new MatTableDataSource<ProductInfo>(this.productInfos);

  displayedProductInfosColumns: string[] = ['color', 'size', 'quantity', 'delete'];

  pageHandlerProductInfo = {
    totalSize: 0,
    pageIndex: 0,
    pageSize: 5,
  }

  selectedProduct!: ProductRequired;
  actionScreen: string = 'add';

  constructor(
    public productService: ProductScreenService,
    public productDetailService: ProductDetailService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductRequired) {
      console.log("Dasta => ", data)
      if(data){
        this.selectedProduct = data as ProductRequired;
        this.actionScreen = 'edit';
        this.productId = data.productId;
        this.productNameControl.setValue(data.productName);
        this.productDescControl.setValue(data.productDesc);
        this.productValueControl.setValue(data.productValue);
        this.inStockControl.setValue(data.inStock);

        this.getCategories().subscribe({
          next: (response: any )=> {
            if(this.selectedProduct.categories.length > 0){
              for(let category of data.categories){
                this.setCategory(category);
              }
            }

            this.productService.getCategoriesByFilter("").subscribe({
              next: (response)=> {
                this.categoryOptions = response as Category[];

                this.filteredCategoryOptions = this.categoryCtrl.valueChanges.pipe(
                  startWith(''),
                  map(value => {
                    console.log("Value => ", value)
                    return this._filterCategory(value || '')
                  }),
                );
              }
            });
          }
        });

        this.getProductInfos(this.productId);
        this.getAndSetImages();

      } else {
        this.actionScreen = 'add';
        this.getCategories().subscribe({
          next: (response: any )=> {
            this.productService.getCategoriesByFilter("").subscribe({
              next: (response)=> {
                this.categoryOptions = response as Category[];

                this.filteredCategoryOptions = this.categoryCtrl.valueChanges.pipe(
                  startWith(''),
                  map(value => {
                    console.log("Value => ", value)

                    return this._filterCategory(value || '')
                  }),
                );
              }
            });
          }
        });
      }

      this.getColorsSizes();
  }

  ngOnInit(): void {
    this.colorControl.valueChanges.subscribe( color => {
      console.log("Color => ", color)
      this.selectedColorInfo = color;
    })

    this.sizeControl.valueChanges.subscribe( size => {
      console.log("Size => ", size)
      this.selectedSizeInfo = size;

    })

    this.quantityControl.valueChanges.subscribe( quant => {
      if(quant < 0){
        this.quantityControl.setValue(0, {emitEvent: false});
        quant = 0;
      }
      if(quant > 99999) {
        this.quantityControl.setValue(99999, {emitEvent: false});
        quant = 99999;
      }
      this.selectedQuantityInfo = quant;
    })
  }


  saveProduct(){
    console.log("Saving");
    if(this.validateFieldsToSave()){
      console.log("Validate fileds ")

      let product: Product = {
        productName: this.productNameControl.value,
        productDesc: this.productDescControl.value,
        productValue: this.productValueControl.value,
        inStock: this.inStockControl.value,
        categories: this.selectedCategories,
        images: []
      }

      if(this.actionScreen == 'edit'){
        product.productId = this.productId;
      }


      this.productService.saveProduct(product).subscribe({
        next: (response: ProductRequired) => {
          if(response.productId){
            this.productId = response.productId;
            this.selectedProduct = response as ProductRequired;
            this.saveProductInfos();
            this.saveProductImage();
            this._snackBar.open("Produto atualizado com sucesso!", "Ok", {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            })
            this.dialogRef.close(true);
          } else {
            console.log("PRODUTO NAO FOI SALVO COM SUCESSO!");
          }
        },
        error: (error) => {
          this._snackBar.open(error, "Ok", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          })
        }
      })
    } else {
      this._snackBar.open("Informe os campos obrigatórios!", "Ok", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })
    }
  }

  validateFieldsToSave(){
    let isValid: boolean = true;

    if(this.productNameControl.value == undefined ||
      (this.productNameControl.value != undefined && this.productNameControl.value.trim() == '')){
      this.productNameControl.setValue('', {emitEvent: false});
      this.productNameControl.setValidators(Validators.required);
      this.productNameControl.setErrors(Validators.required);
      this.productNameControl.markAsTouched();

      isValid = false;
    }

    if(this.productDescControl.value == undefined ||
      (this.productDescControl.value != undefined && this.productDescControl.value.trim() == '')){
      this.productDescControl.setValue('', {emitEvent: false});
      this.productDescControl.setValidators(Validators.required);
      this.productDescControl.setErrors(Validators.required);
      this.productDescControl.markAsTouched();

      isValid = false;
    }

    if(this.productValueControl.value == undefined){
      this.productValueControl.setValidators(Validators.required);
      this.productValueControl.setErrors(Validators.required);
      this.productValueControl.markAsTouched();

      isValid = false;
    }

    if(this.selectedCategories.length == 0){
      this.chipGridCategory.errorState = true;

      isValid = false;
    }

    if(this.mainImage == null && this.selectedImage == null){
      isValid = false;
    }

    return isValid;
  }

  saveProductInfos() {
    if(this.productInfos.length > 0 && this.selectedProduct){
      for(let prodInfo of this.productInfos){
        prodInfo.product = this.selectedProduct as ProductRequired;
      }

      this.productService.saveProductInfos(this.productInfos).subscribe({
        next: (response) => {
          this._snackBar.open("Product Infos salvas com sucesso!", "Ok", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          })
        }, error: (error) => {
          this._snackBar.open(error, "Ok", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          })
        }
      })
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }

  displayCategory(category: Category): string {
    return category && category.categoryName ? category.categoryName : '';
  }

  removeCategory(category: Category): void {
    const index = this.selectedCategories.indexOf(category);

    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    }
  }

  setCategoryDataTable(event: MatAutocompleteSelectedEvent){
    let category: Category = event.option.value;
    this.setCategory(category);
  }

  setCategory(category: Category){
    const catIndex = this.selectedCategories.findIndex((e)=> e.categoryId == category.categoryId);
    if(catIndex === -1){
      this.selectedCategories.push(category);
      this.chipGridCategory.errorState = false;
    }

    this.categoryCtrl.setValue('');
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    console.log("Event => ", value)
    // Add our fruit
    /*if (value) {
      this.selectedCategories.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.categoryCtrl.setValue(null);*/
  }

  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    if (key === '-' || key === 'Minus' || key === '+' || key === 'Plus') {
      event.preventDefault();
    }
  }

  updateAnswers(element: any) {
    console.log("Element => ", element)
  }

  setProductImage(event: any){
    this.setSelectedImage(event.target.files[0]);
  }

  setSelectedImage(file: File){
    this.selectedImage = file;
    this.previewImage(file);
  }

  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (event: any)=> {
      if(this.mainImage != undefined && this.mainImage.productImageId != -1){
        this.imagesToDelete.push(this.mainImage.productImageId);
      }
      this.mainImage = {productImageId: -1, file: file, label: "Imagem principal", url: event.target.result, isMain: true}
    }

    if(file){
      reader.readAsDataURL(file);
    }
  }

  saveProductImage() {
    if(this.selectedImage || this.mainImage){
      const formData = new FormData();
      let imageOrder: boolean[] = [];

      if(this.selectedImage){
        formData.append('file', this.selectedImage);
        imageOrder.push(true)
      }

      for(let image of this.secondaryImages){
        if(image.file){
          formData.append('file', image.file);
          imageOrder.push(false)
        }
      }

      formData.append('imageOrder', imageOrder.toString());

      if(this.imagesToDelete.length > 0){
        this.productService.deleteImages(this.imagesToDelete).subscribe({
          next: (response:any) => {
            console.log("Sucesso : ", response)
          }, error: (response:any) => {
            console.log("Error : ", response)
          }
        })
      }

      if(formData.has('file')){
        this.productService.saveProductImage(formData, this.productId).subscribe({
          next: (response:any) => {
            console.log("Sucesso : ", response)
          }, error: (response:any) => {
            console.log("Error : ", response)
          }
        })
      }
    }
  }

  setSecondaryImageEvent(event: any){
    console.log("Event => ", event)
  }

  setAndAddCard(event: any){
    console.log("Event => ", event)
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const label = `Secondary ${this.secondaryImages.length + 1}`;
        const url = reader.result as string;
        this.secondaryImages.push({productImageId: -1, file: file, label: label, url: url, isMain: false});
        console.log("Secondat image => ", this.secondaryImages)
      };

      console.log("Lendo as data url")
      reader.readAsDataURL(file);
    }
  }

  setSecondaryImage(event: any, image: Image, index: number){
    console.log("Event => ", event, " image => ", image, " index => ", index);
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const label = `Secondary ${this.secondaryImages.length + 1}`;
        const url = reader.result as string;
        this.secondaryImages[index] = {productImageId: -1, file: file, label: label, url: url, isMain: false};
        console.log("Secondat image => ", this.secondaryImages)
      };

      reader.readAsDataURL(file);
    }
  }

  removeSecondaryImage(image: Image, index: number){
    if(image.productImageId != -1){
      let delDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: "Tem certeza que deseja remover esta imagem?"
        }
      })

      delDialog.afterClosed().subscribe( result => {
        if(result){
          this.imagesToDelete.push(image.productImageId);
          this.removeDataSecondaryImage(image, index);
        }
      })
    } else {
      this.removeDataSecondaryImage(image, index);
    }
  }

  removeDataSecondaryImage(image: Image, index: number){
    console.log("iNDEX =>", index)
      if (index !== -1) {
        this.secondaryImages[index].file = null;
        this.secondaryImages[index].url = '';
        this.secondaryImages[index].label = 'Escolha uma imagem';
        this.secondaryImages[index].isMain = false;
      }
  }

  removeMainImage(){
    if(this.mainImage != undefined && this.mainImage.productImageId != undefined && this.mainImage.productImageId != -1){
      let delDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: "Tem certeza que deseja remover a imagem principal?"
        }
      })

      delDialog.afterClosed().subscribe( result => {
        if(result){
          if(this.mainImage && this.mainImage.productImageId != undefined && this.mainImage.productImageId != -1)
            this.imagesToDelete.push(this.mainImage.productImageId);
          this.removeDataMainImage();
        }
      })
    } else {
      this.removeDataMainImage();
    }
  }

  removeDataMainImage(){
    this.selectedImage = null;
    this.mainImage = undefined;
  }

  handlePageProductInfo(event: any): void {

    this.pageHandlerProductInfo.pageIndex = event.pageIndex;
    this.pageHandlerProductInfo.pageSize = event.pageSize;
    if(this.actionScreen == 'add'){
      let index = this.pageHandlerProductInfo.pageIndex*this.pageHandlerProductInfo.pageSize;
      this.dataSourceProductInfos = new MatTableDataSource<ProductInfo>(this.productInfos.slice(index, index + this.pageHandlerProductInfo.pageSize));
    } else {
      this.getProductInfos(this.productId);
    }
  }

  addProductInfo(){
    if(this.selectedColorInfo && this.selectedSizeInfo && this.selectedQuantityInfo > 0){
      if(this.actionScreen == 'add'){
        const fIndex = this.productInfos.findIndex( (e) => e.color.colorId == this.selectedColorInfo.colorId && e.size.sizeId == this.selectedSizeInfo.sizeId )

        console.log("Finded => ", fIndex)
        if(fIndex !== -1){
          this.productInfos[fIndex].quantity += this.selectedQuantityInfo;
        } else {
          const prodInfo: ProductInfo = {
            product: this.selectedProduct as ProductRequired,
            color: this.selectedColorInfo,
            size: this.selectedSizeInfo,
            quantity: this.selectedQuantityInfo
          }
          this.productInfos.push(prodInfo);
        }

        let index = this.pageHandlerProductInfo.pageIndex;
        this.dataSourceProductInfos = new MatTableDataSource<ProductInfo>(this.productInfos.slice(index, index + this.pageHandlerProductInfo.pageSize));

        this.pageHandlerProductInfo.totalSize = this.productInfos.length;
      } else {
        const fIndex = this.productInfos.findIndex( (e) => e.color.colorId == this.selectedColorInfo.colorId && e.size.sizeId == this.selectedSizeInfo.sizeId )
        let saveProdInfo: ProductInfo;

        console.log("Finded => ", fIndex)
        if(fIndex !== -1){
          this.productInfos[fIndex].quantity += this.selectedQuantityInfo;
          saveProdInfo = this.productInfos[fIndex];
          this.productDetailService.updateProductInfoQuantity(saveProdInfo).subscribe({
            next: (response:any) => {
              this.getProductInfos(this.productId);
            }
          });
        } else {
          const prodInfo: ProductInfo = {
            product: this.selectedProduct,
            color: this.selectedColorInfo,
            size: this.selectedSizeInfo,
            quantity: this.selectedQuantityInfo
          }
          this.productInfos.push(prodInfo);

          this.productService.saveProductInfos(this.productInfos).subscribe({
            next: (response) => {
              this.getProductInfos(this.productId);
            }, error: (response) => {
              console.log("Response ERROR => ", response)
            }
          })
        }
      }
    }
  }

  removeInfo(prodInfo: ProductInfo){
    let dialogDelete = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Você deseja deletar esta informação?"
      }
    })

    dialogDelete.afterClosed().subscribe( result => {
      if(result){
        this.productDetailService.deleteProductInfo(prodInfo).subscribe({
          next: (response:any) => {
            this.pageHandlerProductInfo.pageIndex = 0;
            this.getProductInfos(prodInfo.product.productId);
            this._snackBar.open("Informação removida com sucesso!", "Ok", {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            })
          }
        })
      }
    });
    /*const fIndex = this.productInfos.findIndex( (e) => e.color.colorId == prodInfo.color.colorId && e.size.sizeId == prodInfo.size.sizeId);

    if(fIndex !== -1){
      this.productInfos.splice(fIndex, 1);

      this.pageHandlerProductInfo.pageIndex = 0;
      let index = this.pageHandlerProductInfo.pageIndex;
      this.dataSourceProductInfos = new MatTableDataSource<ProductInfo>(this.productInfos.slice(index, index + this.pageHandlerProductInfo.pageSize));

      this.pageHandlerProductInfo.totalSize = this.productInfos.length;
    }*/
  }

  getProductInfos(productId: number){
    this.productDetailService.getProductInfos(productId, this.pageHandlerProductInfo.pageIndex, this.pageHandlerProductInfo.pageSize).subscribe({
      next: (response: any)=> {
        this.productInfos = response.content as ProductInfo[];
        this.dataSourceProductInfos =  new MatTableDataSource<ProductInfo>(this.productInfos);

        this.pageHandlerProductInfo.totalSize = response.totalElements;
        this.pageHandlerProductInfo.pageIndex = response.pageable.pageNumber;
        this.pageHandlerProductInfo.pageSize = response.pageable.pageSize;
        console.log("Response =>", response)
      },
      error: (response: any) => {
        console.log("Error")
      }
    })
  }

  getAndSetImages(){
    if(this.selectedProduct.images.length > 0) {
      for(let prodImage of this.selectedProduct.images){
        if(prodImage.mainImage && prodImage.imagePath){
          this.mainImage = {productImageId: prodImage.productImageId, file: null, label: "Imagem principal", url: prodImage.imagePath, isMain: true};
        } else if(prodImage.imagePath){
          console.log("pROD IMAGE => ", prodImage)
          const image: Image = {productImageId: prodImage.productImageId, file: null, label: 'Escolha uma imagem', url: prodImage.imagePath, isMain: false}
          const imageIndex = this.secondaryImages.findIndex((e)=> (e.url == null || e.url == ""));

          if(imageIndex !== -1){
            this.secondaryImages[imageIndex] = image;
          } else {
            this.secondaryImages.push(image);
          }
        }
      }
    }
  }

  getCategories(): Observable<any>{
    return new Observable((observer) => {

      this.productService.getCategoriesByFilter("").subscribe({
        next: (response)=> {
          this.categoryOptions = response;
          observer.next(response);
          observer.complete();
          console.log("Response => ", response)
          console.log("Category Options => ", this.categoryOptions)
        },
        error: (response)=> {
          console.log("Response ERRO => ", response)
          observer.error(response);
          observer.complete();
        }
      });
    })
  }

  getColorsSizes(){
    this.productService.getColors().subscribe( response => {
      this.colors = response as Color[];
    })

    this.productService.getSizes().subscribe( response => {
      this.sizes = response as Size[];
    })
  }

  private _filterCategory(value: any): Category[] {
    console.log("Vaslue => ", value)
    const filter = value.categoryName || value;
    return this.categoryOptions.filter(option => {
      if(option.categoryName){
        return option.categoryName.toUpperCase().includes(filter.toUpperCase());
      }
      return ;
    });
  }

}
