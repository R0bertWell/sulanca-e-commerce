import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from './../forms/product-screen/models/category.model';
import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ProductScreenService } from '../forms/product-screen/services/product-screen.service';
import { Product } from '../forms/product-screen/models/product.model';
import { CartService } from 'src/app/shared/cart/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { GlobalVariablesService } from 'src/app/shared/global/global-variables.service';
import { FormControl } from '@angular/forms';
import { ProductListService } from './services/product-list.service';
import { ProductTag } from './models/product-tag.model';

export interface Image{
  path: ''
}

@Component({
  selector: 'app-product-list-screen',
  templateUrl: './product-list-screen.component.html',
  styleUrls: ['./product-list-screen.component.scss']
})
export class ProductListScreenComponent {
  colorPicker: number = 1;
  radioControl: FormControl = new FormControl(1);
  serverSideUrl = '';

  PRODUCT_DATA: Product[] = [];
  CATEGORY_DATA: Category[] = [];
  PRODUCTS_TAGGEDS: ProductTag[] = [];

  selectedCategory?: Category;

  images: Image[] = []

  carousel_height: number = 400;
  carousel_cell_width: number = 300;

  pageHandlerProduct = {
    totalSize: 0,
    pageIndex: 0,
    pageSize: 15,
    options: [10,25,100]
  }

  product_filter = {
    categoryId: -1
  }

  categoryControl: FormControl = new FormControl('');

  constructor(private productService: ProductScreenService,
              private productListService: ProductListService,
              private breakpointObserver: BreakpointObserver,
              public cartService: CartService,
              private http: HttpClient,
              private router: Router,
              private renderer: Renderer2, private el: ElementRef,
              private activeRoute: ActivatedRoute,
              public globalServ: GlobalVariablesService
              ){
                console.log("Cat => ", this.router.getCurrentNavigation()?.extras.state?.['categoryControl'])
    this.categoryControl.setValue(-1);
    if(this.router.getCurrentNavigation()?.extras.state?.['categoryControl']){
      this.categoryControl = this.router.getCurrentNavigation()?.extras.state?.['categoryControl'];
      console.log("Cat => ", this.categoryControl)
    }

    globalServ.getServerSideUrl().subscribe({
      next: (response: string)=> {
        this.serverSideUrl = response + "/";
      }
    });
    console.log("Server side url => ", this.serverSideUrl)
                console.log("cART SERVICE=> ", this.cartService)
    this.getCategories();
    this.getProducts();
    this.getProductsByCategory();
  }

  ngOnInit() {
    this.categoryControl.valueChanges.subscribe( category => {
      this.selectedCategory = category;
      this.product_filter.categoryId = this.selectedCategory && this.selectedCategory.categoryId ? this.selectedCategory?.categoryId : -1;
      this.pageHandlerProduct.pageIndex = 0;
      this.getProducts();
    })

    this.updateCarouselDimensions();

  }

  getProducts(){
    this.productService.getProductsByFilter(this.pageHandlerProduct.pageIndex, this.pageHandlerProduct.pageSize, this.product_filter)
      .subscribe({
        next: (response: any)=> {
          console.log("Response GET PRODUCTS=> ", response)

          this.PRODUCT_DATA = response.content as Product[];
          for(let product of this.PRODUCT_DATA){
            for(let images of product.images){
              images.imagePath = this.serverSideUrl + images.imagePath;
              this.images.push({path: images.imagePath} as Image)
            }
          }

          this.pageHandlerProduct.totalSize = response.totalElements;
          this.pageHandlerProduct.pageIndex = response.pageable.pageNumber;
          this.pageHandlerProduct.pageSize = response.pageable.pageSize;
          window.scrollTo({ top: 0, behavior: 'smooth' });

      },
      error: (response: any)=> {
        console.log("Error GET PRODUCTS=> ", response)
      }
    });
  }

  getProductsByCategory(){
    this.productListService.getProductsByCategories().subscribe({
      next: (response: ProductTag[]) => {
        console.log("Product tags => ", response)
        let PRODUCT_TAGS: ProductTag[] = response as ProductTag[];
        for(let category of PRODUCT_TAGS){
          for(let product of category.products){
            for(let image of product.images){
              image.imagePath = this.serverSideUrl + image.imagePath;
            }
          }
        }
        this.PRODUCTS_TAGGEDS = PRODUCT_TAGS;
        console.log("Products tagged=> ", this.PRODUCTS_TAGGEDS)

      }
    })
  }

  getCategories(){
    this.productService.getCategoriesByFilter("").subscribe({
      next: (response)=> {
        this.CATEGORY_DATA = response as Category[];
        console.log("Response => ", response)
      },
      error: (response)=> {
        console.log("Response ERRO => ", response)
      }
    });
  }

  setCategory(category: Category) {
    if(category.categoryId){
      this.selectedCategory = category;
      this.product_filter.categoryId = category.categoryId;
      this.pageHandlerProduct.pageIndex = 0;
      this.getProducts();
    }
    console.log("Category => ", category)
  }

  allProducts(){
    this.selectedCategory = undefined;
    this.product_filter.categoryId = -1;
    this.pageHandlerProduct.pageIndex = 0;
    this.getProducts();
  }

  addToCart(product: Product) {
    console.log("Product =>", product)
  }

  goToProductDetails(product: Product) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/product-detail'], {skipLocationChange: true, state: {product}});
  }

  handlePage(event: any): void {
    console.log("Handle page => ", event)
    console.log("Before Page handler => ", this.pageHandlerProduct)
    this.pageHandlerProduct.pageIndex = event.pageIndex;
    this.pageHandlerProduct.pageSize = event.pageSize;
    console.log("Page handler => ", this.pageHandlerProduct)
    this.getProducts();
  }

  calculateCarouselDimensions() {
    const windowWidth = window.innerWidth;
    const windowHeigth = window.innerHeight;

    // Defina lógica para calcular o novo height e cellWidth com base no tamanho da tela.
    // Por exemplo, você pode ter lógica diferente para dispositivos móveis e computadores.

    let newHeight;
    let newCellWidth;

    // Lógica de exemplo para dispositivos móveis
    if (windowWidth < 900) {
      newCellWidth = windowWidth  / 2.3;
      newHeight = newCellWidth + 100;

    } else
    if ( windowWidth < 1200) {
      newCellWidth = windowWidth / 3.5;
      newHeight = newCellWidth + 100;
    }
    else {
      newCellWidth = windowWidth / 5.5;
      newHeight = newCellWidth + 100;
      // Lógica de exemplo para computadores
    }
    //newHeight = windowWidth / 4;
    //newCellWidth = newHeight;
    //}

    return { newHeight, newCellWidth };
  }

  updateCarouselDimensions() {
    const { newHeight, newCellWidth } = this.calculateCarouselDimensions();
    console.log("New height width => ", newHeight , " / " , newCellWidth)
    this.carousel_height = newHeight;
    this.carousel_cell_width = newCellWidth;
    console.log("Carousle height => ", this.carousel_height)
    // Use o Renderer2 para atualizar as propriedades do carousel
    //this.renderer.setStyle(this.el.nativeElement.querySelector('carousel'), 'height', `${newHeight}px`);
    //this.renderer.setStyle(this.el.nativeElement.querySelector('carousel'), 'width', `${newCellWidth}px`);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log("Resizing => ", event)
    this.updateCarouselDimensions();
  }

  uploadImage(event: any){
    const file = document.getElementById("file");
    const img = document.getElementById("img");
    const url = document.getElementById("url");
    const formData = new FormData();
    formData.append("image", event.target.files[0]);

    const headers = new HttpHeaders({
      Authorization: "Client-ID 1f83eb04ba3b8c7"
    });

    this.http.post("https://api.imgur.com/3/image/", formData, { headers}).subscribe({
      next: (response: any) => {
        console.log("Respone => ", response)
      },
      error: (response: any) => {
        console.log("Respone error => ", response)

      }
    })

  }

}
