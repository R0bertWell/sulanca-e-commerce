import {COMMA, ENTER, F} from '@angular/cdk/keycodes';

import { Category } from './models/category.model';
import { Product, ProductRequired } from './models/product.model';
import { ProductScreenService } from './services/product-screen.service';
import { Component, ElementRef, HostListener, ViewChild, inject} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Color, ProductInfo, Size } from './models/product-info.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProductDetailService } from '../../product-detail-screen/services/product-detail.service';
import { GlobalVariablesService } from 'src/app/shared/services/global/global-variables.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './dialogs/product-dialog/product-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Image {
  file: File | null,
  label: string,
  url: string,
  isMain: boolean
}

@Component({
  selector: 'app-product-screen',
  templateUrl: './product-screen.component.html',
  styleUrls: ['./product-screen.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductScreenComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  @ViewChild("chipListCategory") chipListCategory: any;

  categoryCtrl = new FormControl('');

  categoryOptions: Category[] = [];
  selectedCategories: Category[] = [];
  filteredCategoryOptions!: Observable<Category[]>;

  // Search
  searchProductControl: FormControl = new FormControl('');
  seachInStockControl: FormControl = new FormControl(true);

  productNameControl: FormControl = new FormControl('')
  productDescControl: FormControl = new FormControl('')
  productValueControl: FormControl = new FormControl(0)
  inStockControl: FormControl = new FormControl(true)

  selectedImage: File | null = null;
  imagePreview?: string;

  currentImageIndex: number = 0;
  images: string[] = ['', '', ''];
  nullImage: Image = {file: null, label: 'Escolha uma imagem', url: '', isMain: false};
  secondaryImages: Image[] = [
    {file: null, label: 'Escolha uma imagem', url: '', isMain: false},
    {file: null, label: 'Escolha uma imagem', url: '', isMain: false},
    {file: null, label: 'Escolha uma imagem', url: '', isMain: false},
    {file: null, label: 'Escolha uma imagem', url: '', isMain: false}
  ];
  newImageUrl: string = '';

  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];


  colorControl: FormControl = new FormControl('');
  sizeControl: FormControl = new FormControl('');
  quantityControl: FormControl = new FormControl(0);

  selectedColorInfo!: Color;
  selectedSizeInfo!: Size;
  selectedQuantityInfo!: number;

  sizeAddControl: FormControl = new FormControl('');
  sizeNameToAdd: string = '';
  colorAddControl: FormControl = new FormControl('');
  colorNameToAdd: string = '';
  colorPickerControl: FormControl = new FormControl('');
  colorHexToAdd: string = '';

  colors: Color[] = [];
  sizes: Size[] = [];
  productInfos: ProductInfo[] = [];
  productInfo!: ProductInfo;

  savedProductId: number = -1;
  savedProduct!: Product;

  displayedProductInfosColumns: string[] = ['color', 'size', 'quantity', 'delete'];
  displayedProductInfosColumnsTable: string[] = ['color', 'size', 'quantity', 'edit', 'delete'];


  productInfosTable: ProductInfo[] = [];
  dataSourceProductInfosTable = new MatTableDataSource<ProductInfo>(this.productInfosTable);

  dataSourceProductInfos = new MatTableDataSource<ProductInfo>(this.productInfos);

  categoryNameControl = new FormControl('')

  categoryName?: string;

  displayedColumns: string[] = ['productId', 'productName', 'productDesc', 'productValue', 'inStock', 'edit', 'remove'];
  PRODUCT_DATA: Product[] = [];
  dataSource = new MatTableDataSource<Product>(this.PRODUCT_DATA);

  // expanded datasource
  columnsToDisplay = ['productId', 'productName', 'productDesc', 'productValue', 'inStock'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement?: ProductRequired;

  pageHandlerProduct = {
    totalSize: 0,
    pageIndex: 0,
    pageSize: 10,
    options: [10,25,100]
  }

  pageHandlerProductInfo = {
    totalSize: 0,
    pageIndex: 0,
    pageSize: 5,
  }

  pageHandlerProductInfoList = {
    totalSize: 0,
    pageIndex: 0,
    pageSize: 5,
  }

  product_filter = {
    product_search: '',
    inStock: true
  }

  updateSubject = new Subject();

  constructor(
    public dialog: MatDialog,
    private productService: ProductScreenService,
    private productDetailService: ProductDetailService,
    private _snackBar: MatSnackBar,
    public globalServ: GlobalVariablesService
    ){

    this.getCategories();
    this.getProducts();

    this.productService.getCategoriesByFilter("").subscribe({
      next: (response)=> {
        this.categoryOptions = response as Category[];

        this.filteredCategoryOptions = this.categoryCtrl.valueChanges.pipe(
          startWith(''),
          map(value => {
            return this._filterCategory(value || '')
          }),
        );
      },
      error: (response)=> {
        console.log("Response ERRO => ", response)
      }
    });

    this.productService.getColors().subscribe( response => {
      this.colors = response as Color[];
    })

    this.productService.getSizes().subscribe( response => {
      this.sizes = response as Size[];
    })
  }

  ngOnInit(): void {
    this.productValueControl.valueChanges.subscribe( value => {
      if(value == null || value < 0){
        this.productValueControl.setValue(0, {emitEvent: false});
      }
      if(value > 99999){
        this.productValueControl.setValue(99999, {emitEvent: false});
      }

    })

    this.categoryNameControl.valueChanges.subscribe( category => {
      if(category){
        this.categoryName = category.trim();
      }
    })

    this.colorControl.valueChanges.subscribe( color => {
      console.log("Color => ", color)
      this.selectedColorInfo = color;
    })

    this.sizeControl.valueChanges.subscribe( size => {
      console.log("Size => ", size)
      this.selectedSizeInfo = size;

    })

    this.quantityControl.valueChanges.subscribe( quant => {
      if(quant == null || quant < 0){
        this.quantityControl.setValue(0, {emitEvent: false});
        quant = 0;
      }
      if(quant > 99999) {
        this.quantityControl.setValue(99999, {emitEvent: false});
        quant = 99999;
      }
      this.selectedQuantityInfo = quant;
    })

    this.sizeAddControl.valueChanges.subscribe( size => {
      this.sizeNameToAdd = size;
    })

    this.colorAddControl.valueChanges.subscribe( color => {
      this.colorNameToAdd = color;
    })

    this.colorPickerControl.valueChanges.subscribe( picker => {
      this.colorHexToAdd = picker;
    })

    this.updateSubject
    .pipe(debounceTime(150))
    .subscribe((element: any) => {
      if(element.quantity == null || element.quantity < 0){
        element.quantity = 0;
      } else
      if(element.quantity > 99999){
        element.quantity = 99999;
      }
      this.updateAnswers(element);
    });

    this.searchProductControl.valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(500)
    )
    .subscribe((search: string) => {
      this.product_filter.product_search = search;
      this.getProducts();
    })

    this.seachInStockControl.valueChanges
    .pipe(
      distinctUntilChanged(),
      debounceTime(500)
    )
    .subscribe((inStock: boolean) => {
      console.log("In stock => ", inStock)
      this.product_filter.inStock = inStock;
      this.getProducts();
    })
  }

  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    if (key === '-' || key === 'Minus' || key === '+' || key === 'Plus') {
      event.preventDefault();
    }
  }

  getProducts(){
    this.productService.getProductsByFilter(this.pageHandlerProduct.pageIndex, this.pageHandlerProduct.pageSize, this.product_filter)
      .subscribe({
        next: (response: any)=> {
          console.log("Response GET PRODUCTS=> ", response)

          this.PRODUCT_DATA = response.content as Product[];
          this.dataSource = new MatTableDataSource<Product>(this.PRODUCT_DATA);

          this.pageHandlerProduct.totalSize = response.totalElements;
          this.pageHandlerProduct.pageIndex = response.pageable.pageNumber;
          this.pageHandlerProduct.pageSize = response.pageable.pageSize;
      },
      error: (response: any)=> {
        console.log("Error GET PRODUCTS=> ", response)
      }
    });
  }

  setProductInStock(product: Product){
    const productId = product.productId;
    if(productId){
      this.productService.updateProductInStock(productId, product.inStock).subscribe({
        next: (response: any) => {
          this._snackBar.open("Produto atualizado com sucesso!", "Ok", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          })
        }, error: (error: any) => {
          this._snackBar.open(error, "Ok", {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          })        }
      })
    }
  }

  handlePage(event: any): void {
    console.log("Handle page => ", event)
    console.log("Before Page handler => ", this.pageHandlerProduct)
    this.pageHandlerProduct.pageIndex = event.pageIndex;
    this.pageHandlerProduct.pageSize = event.pageSize;
    console.log("Page handler => ", this.pageHandlerProduct)
    this.getProducts();
  }

  handlePageProductInfo(event: any): void {
    this.pageHandlerProductInfo.pageIndex = event.pageIndex;
    this.pageHandlerProductInfo.pageSize = event.pageSize;
    let index = this.pageHandlerProductInfo.pageIndex*this.pageHandlerProductInfo.pageSize;
    this.dataSourceProductInfos = new MatTableDataSource<ProductInfo>(this.productInfos.slice(index, index + this.pageHandlerProductInfo.pageSize));
  }

  handlePageProductInfoList(event: any, prodInfo: Product): void {
    if(prodInfo.productId){
      this.pageHandlerProductInfoList.pageIndex = event.pageIndex;
      this.pageHandlerProductInfoList.pageSize = event.pageSize;
      this.getProductInfos(prodInfo.productId);
    }
  }

  saveProduct(){
    if(this.validateFieldsToSave()){
      const product: Product = {
        productName: this.productNameControl.value,
        productDesc: this.productDescControl.value,
        productValue: this.productValueControl.value,
        inStock: this.inStockControl.value,
        categories: this.selectedCategories,
        images: []
      }

      this.productService.saveProduct(product).subscribe({
        next: (response: Product) => {
          if(response.productId){
            this.savedProductId = response.productId;
            this.savedProduct = response;
            this.saveProductInfos();
            this.saveProductImage();
            console.log("pRODUT OSALVO COM SUCESSO!")
          } else {
            console.log("PRODUTO NAO FOI SALVO COM SUCESSO!");
          }
          this.getProducts();
        },
        error: (response) => {
          console.log("ERROR => ", response)
          console.log("Erro ao salvar o Produto!");
        }
      })
    }
  }

  validateFieldsToSave(){
    let isInvalid: boolean = false;
    if(this.productNameControl.value == undefined || this.productNameControl.value.trim() == ''){
      this.productNameControl.setValidators(Validators.required);
      this.productNameControl.setErrors(Validators.required);
      this.productNameControl.markAsTouched();

      isInvalid = true;
    }

    if(this.productDescControl.value == undefined || this.productDescControl.value.trim() == ''){
      this.productDescControl.setValidators(Validators.required);
      this.productDescControl.setErrors(Validators.required);
      this.productDescControl.markAsTouched();

      isInvalid = true;
    }

    if(this.productValueControl.value == undefined){
      this.productValueControl.setValidators(Validators.required);
      this.productValueControl.setErrors(Validators.required);
      this.productValueControl.markAsTouched();

      isInvalid = true;
    }

    if(isInvalid){
      console.log("Form inválido!")
      return false;
    }
    return true;
  }

  saveProductInfos() {
    if(this.productInfos.length > 0 && this.savedProduct){
      for(let prodInfo of this.productInfos){
        prodInfo.product = this.savedProduct as ProductRequired;
      }

      this.productService.saveProductInfos(this.productInfos).subscribe({
        next: (response) => {
          console.log("Response ok => ", response)
        }, error: (response) => {
          console.log("Response ERROR => ", response)
        }
      })
    }
  }

  saveProductImage() {
    if(this.selectedImage){
      const formData = new FormData();
      formData.append('file', this.selectedImage);

      let imageOrder: boolean[] = [true];
      let i = 0;
      for(let image of this.secondaryImages){
        console.log("Image =>")
        if(image.file){
          formData.append('file', image.file);
          i++;
          imageOrder.push(false);
        }
      }

      formData.append('imageOrder', imageOrder.toString());

      this.productService.saveProductImage(formData, this.savedProductId).subscribe({
        next: (response:any) => {
          console.log("Sucesso : ", response)
        }, error: (response:any) => {
          console.log("Error : ", response)
        }
      })
    }
  }

  saveCategory(){
    if(this.categoryName != undefined && this.categoryName.trim() != ''){
      let category: Category = {categoryName: this.categoryName}
      this.productService.saveCategory(category).subscribe({
        next: (response)=> {
          console.log("Categoria salva com sucesso!")
        },
        error: (error)=> {
          console.log(error)
        }
      });
    } else {
      console.log("A descrição da categoria não foi informada!")
    }
  }

  saveSize() {
    if(this.sizeNameToAdd == undefined || this.sizeNameToAdd.trim() == ''){
      console.log("Nome vazio");
      this.sizeAddControl.setErrors(Validators.required);
      this.sizeAddControl.markAsTouched();
    } else {
      const size: Size = {
        sizeId: undefined,
        sizeName: this.sizeNameToAdd
      }
      this.productService.saveSize(size).subscribe({
        next: (response)=> {
          console.log("Tamanho salvo com sucesso!")
        },
        error: (error)=> {
          console.log(error)
        }
      })
    }
  }

  saveColor() {
    if(this.colorNameToAdd == undefined || this.colorNameToAdd.trim() == ''){
      console.log("cor Nome vazio");
      this.colorAddControl.setErrors(Validators.required);
      this.colorAddControl.markAsTouched();
      return;
    }

    if(this.colorHexToAdd == undefined || this.colorHexToAdd.trim() == ''){
      console.log("cor Nome vazio");
      this.colorPickerControl.setErrors(Validators.required);
      this.colorPickerControl.markAsTouched();
      return;
    }

    const color: Color = {
      colorName: this.colorNameToAdd,
      colorHex: this.colorHexToAdd
    }
    this.productService.saveColor(color).subscribe({
      next: (response)=> {
        console.log("Cor salvo com sucesso!")
      },
      error: (error)=> {
        console.log(error)
      }
    })

  }

  getCategories(){
    this.productService.getCategoriesByFilter("").subscribe({
      next: (response)=> {
        this.categoryOptions = response;
        console.log("Response => ", response)
        console.log("Category Options => ", this.categoryOptions)
      },
      error: (response)=> {
        console.log("Response ERRO => ", response)
      }
    });
  }

  removeCategory(category: Category): void {
    const index = this.selectedCategories.indexOf(category);

    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log("Event => ", event)
    //this.categories.push(event);
   // this.categoryInput.nativeElement.value = '';
   // this.categoryCtrl.setValue(null);
  }

  private _filterCategory(value: string): Category[] {
    return this.categoryOptions.filter(option => {
      if(option.categoryName){
        return option.categoryName.toUpperCase().includes(value.toUpperCase());
      }
      return ;
    });
  }

  displayCategory(category: Category): string {
    return category && category.categoryName ? category.categoryName : '';
  }

  setCategoryDataTable(event: MatAutocompleteSelectedEvent){
    let category: Category = event.option.value;
    if(!this.selectedCategories.includes(category)){
      this.selectedCategories.push(category);
    }

    console.log("Categoryt input => ", this.categoryInput)
    //this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue('');
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    /*if (value) {
      this.selectedCategories.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.categoryCtrl.setValue(null);*/
  }

  addNewProductInfo(product: ProductRequired){
    if(this.selectedColorInfo && this.selectedSizeInfo && this.selectedQuantityInfo > 0){
      const fIndex = this.productInfosTable.findIndex( (e) => e.color.colorId == this.selectedColorInfo.colorId && e.size.sizeId == this.selectedSizeInfo.sizeId )
      let saveProdInfo: ProductInfo;

      console.log("Finded => ", fIndex)
      if(fIndex !== -1){
        this.productInfosTable[fIndex].quantity += this.selectedQuantityInfo;
        saveProdInfo = this.productInfosTable[fIndex];
        this.productDetailService.updateProductInfoQuantity(saveProdInfo).subscribe({
          next: (response:any) => {
            this.getProductInfos(product.productId);
          }
        });
      } else {
        const prodInfo: ProductInfo = {
          product: product,
          color: this.selectedColorInfo,
          size: this.selectedSizeInfo,
          quantity: this.selectedQuantityInfo
        }
        this.productInfosTable.push(prodInfo);

        this.productService.saveProductInfos(this.productInfosTable).subscribe({
          next: (response) => {
            this.getProductInfos(product.productId);
          }, error: (response) => {
            console.log("Response ERROR => ", response)
          }
        })
      }
    }
  }

  addProductInfo(){
    if(this.selectedColorInfo && this.selectedSizeInfo && this.selectedQuantityInfo > 0){
      const fIndex = this.productInfos.findIndex( (e) => e.color.colorId == this.selectedColorInfo.colorId && e.size.sizeId == this.selectedSizeInfo.sizeId )

      console.log("Finded => ", fIndex)
      if(fIndex !== -1){
        this.productInfos[fIndex].quantity += this.selectedQuantityInfo;
      } else {
        const prodInfo: ProductInfo = {
          product: this.expandedElement  as ProductRequired,
          color: this.selectedColorInfo,
          size: this.selectedSizeInfo,
          quantity: this.selectedQuantityInfo
        }
        this.productInfos.push(prodInfo);
      }

      let index = this.pageHandlerProductInfo.pageIndex;
      this.dataSourceProductInfos = new MatTableDataSource<ProductInfo>(this.productInfos.slice(index, index + this.pageHandlerProductInfo.pageSize));

      this.pageHandlerProductInfo.totalSize = this.productInfos.length;
    }
  }

  expandRow(product: Product){
    if(product.productId && this.expandedElement == product){
      this.pageHandlerProductInfo.pageIndex = 0;
      this.getProductInfos(product.productId);
    }
  }

  getProductInfos(productId: number){
    this.productDetailService.getProductInfos(productId, this.pageHandlerProductInfoList.pageIndex, this.pageHandlerProductInfoList.pageSize).subscribe({
      next: (response: any)=> {
        this.productInfosTable = response.content as ProductInfo[];
        this.dataSourceProductInfosTable =  new MatTableDataSource<ProductInfo>(this.productInfosTable);

        this.pageHandlerProductInfoList.totalSize = response.totalElements;
        this.pageHandlerProductInfoList.pageIndex = response.pageable.pageNumber;
        this.pageHandlerProductInfoList.pageSize = response.pageable.pageSize;
        console.log("Response =>", response)
      },
      error: (response: any) => {
        console.log("Error")
      }
    })
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    console.log("Scorlling")
  }


  editProduct(product: ProductRequired){
    let dialog = this.dialog.open(ProductDialogComponent, {
      width: '90%',
      height: '90%',
      data: product
    });

    dialog.afterClosed().subscribe( result => {
      if(result){
        this.getProducts();
      }
    })

  }

  removeProduct(product: ProductRequired){
    let dialogDelete = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Tem certeza que deseja remover este produto?"
      }
    })

    dialogDelete.afterClosed().subscribe( result => {
      if(result) {
        this.productService.deleteProduct(product.productId).subscribe({
          next: (response)=> {
            this.pageHandlerProduct.pageIndex = 0;
            this.getProducts();
          },
          error: (response)=> {

          }
        })
      }
    })
  }

  updateProfInfoRow(prodInfo: ProductInfo){
    let dialogUpdate = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Você deseja atualizar esta informação?"
      }
    })

    dialogUpdate.afterClosed().subscribe( result => {
      if(result){
        this.productDetailService.updateProductInfoQuantity(prodInfo).subscribe({
          next: (response:any) => {
            console.log("Updated com sucesso INFO")
          }
        });
      }
    })

  }

  removeProdInfoRow(prodInfo: ProductInfo){
    console.log("Remove => ", prodInfo)
    let dialogDelete = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Você deseja deletar esta informação?"
      }
    })

    dialogDelete.afterClosed().subscribe( result => {
      if(result){
        this.productDetailService.deleteProductInfo(prodInfo).subscribe({
          next: (response:any) => {
            this.getProductInfos(prodInfo.product.productId);
            console.log("Delted com sucesso INFO")
          }
        })
      }
    });
  }

  updateAnswers(element: any) {
    console.log("Element => ", element)
  }

  setProductImage(event: any){
    this.selectedImage = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = (event: any)=> {
      this.imagePreview = event.target.result;
    }

    if(this.selectedImage){
      reader.readAsDataURL(this.selectedImage);
    }
  }
  saveImage(){
    this.saveProductImage();

  }

  setSecondaryImage(event: any, image: Image, index: any){
    console.log("Event => ", event, " image => ", image, " index => ", index);
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const label = `Secondary ${this.secondaryImages.length + 1}`;
        const url = reader.result as string;
        image.file = file;
        image.url = url;
        image.label = label;
        image.isMain = false;
        console.log("Secondat image => ", this.secondaryImages)
      };

      reader.readAsDataURL(file);
    }
  }

  removeSecondaryImage(image: Image){
    const index = this.secondaryImages.indexOf(image);
    if (index !== -1) {
      this.secondaryImages[index] = this.nullImage;
    }
  }

  removeMainImage(){
    this.selectedImage = null;
    this.imagePreview = undefined;
  }

  removeInfo(prodInfo: ProductInfo){
    const fIndex = this.productInfos.findIndex( (e) => e.color.colorId == prodInfo.color.colorId && e.size.sizeId == prodInfo.size.sizeId);

    if(fIndex !== -1){
      this.productInfos.splice(fIndex, 1);

      this.pageHandlerProductInfo.pageIndex = 0;
      let index = this.pageHandlerProductInfo.pageIndex;
      this.dataSourceProductInfos = new MatTableDataSource<ProductInfo>(this.productInfos.slice(index, index + this.pageHandlerProductInfo.pageSize));

      this.pageHandlerProductInfo.totalSize = this.productInfos.length;
    }
  }

  addProductData(product: ProductRequired){
    let emptyProdInfo: ProductInfo = {
      product: product,
      color: new Color({colorName: '', colorHex: ''}),
      size: new Size({sizeName: ''}),
      quantity: 0
    };

    this.dataSourceProductInfosTable.data.push(emptyProdInfo);
    this.dataSourceProductInfosTable.data = [...this.dataSourceProductInfosTable.data]

  }

  openNewProductDialog(){
    let dialog = this.dialog.open(ProductDialogComponent, {
      width: '90%',
      height: '90%',
    });

    dialog.afterClosed().subscribe( result => {
      console.log("Result => ", result);
      this.getProducts();
    })
  }
}


