import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from './shared/cart/cart.service';
import { Category } from './core/screens/forms/product-screen/models/category.model';
import { ProductScreenService } from './core/screens/forms/product-screen/services/product-screen.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('header') header: ElementRef | undefined;

  private prevScrollPos = window.pageYOffset;
  isHeaderFloating: boolean = false;
  isSmallScreen: boolean = false;
  current_route: string = '';
  title = 'homes';
  CATEGORY_DATA: Category[] = [];
  categoryControl: FormControl = new FormControl('');
  selectedCategory?: Category;

  backgroundStyle: string = '';

  constructor(
    private productService: ProductScreenService,
    private translate: TranslateService,
    private router: Router,
    public cartService: CartService)
  {
    this.backgroundStyle = "url('assets/images/background-moda.jpg')";
    this.selectedCategory = {categoryId: -1, categoryName: "Todas categorias"};
    let userLang = navigator.language;
    this.translate.setDefaultLang('pt-br');
    this.translate.use(localStorage.getItem('locale')?.toLocaleLowerCase() || userLang.toLowerCase());
    localStorage.setItem('locale', userLang.toLowerCase());
    this.calculateScreenWidth();
    this.getCategories();
  }

  ngOnInit(): void{
    this.current_route = '/product-list';
    this.router.navigate(['/product-list'], {skipLocationChange: true, state: {categoryControl: this.categoryControl}});
  }

  ngAfterViewInit() {
    // Verificar se o elemento foi encontrado antes de usar
    if (this.header) {
      this.header.nativeElement.style.top = '0';
    }
  }

  navigateToRoute(route: string){
    console.log("Route => ", route)
    this.current_route = route;
    this.router.navigate([route], {skipLocationChange: true})
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

  openMenu(){

  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isHeaderFloating = window.scrollY > 1; // Defina a posição de rolagem desejada para ativar o cabeçalho flutuante
  }

  calculateScreenWidth() {
    const windowWidth = window.innerWidth;

    // Defina lógica para calcular o novo height e cellWidth com base no tamanho da tela.
    // Por exemplo, você pode ter lógica diferente para dispositivos móveis e computadores.

    let newHeight;
    let newCellWidth;

    // Lógica de exemplo para dispositivos móveis
    if (windowWidth < 900) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log("Resizing => ", event)
    this.calculateScreenWidth();
  }
}
