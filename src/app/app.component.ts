import { GlobalVariablesService } from 'src/app/shared/services/global/global-variables.service';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from './shared/cart/cart.service';
import { Category } from './core/screens/forms/product-screen/models/category.model';
import { ProductScreenService } from './core/screens/forms/product-screen/services/product-screen.service';
import { FormControl } from '@angular/forms';
import { AuthenticationService } from './shared/services/authentication/authentication.service';
import { Config } from './shared/models/config.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('header') header: ElementRef | undefined;

  footer__routes = ['/', '/product-list', 'product-detail'];

  isLoggedIn: boolean = false;

  private prevScrollPos = window.pageYOffset;
  isHeaderFloating: boolean = false;
  lastScrollPosition = 0;
  isScrolledDown = false;
  isSmallScreen: boolean = false;
  current_route: string = '';
  title = 'homes';
  CATEGORY_DATA: Category[] = [];
  categoryControl: FormControl = new FormControl('');
  selectedCategory?: Category;

  // stylish configs
  content_bgImg: string = '';
  content_bgColor: string = 'white';
  nav_bar_bgColor: string = 'black';
  footer_bgColor: string = 'black';
  your_logo: string = 'assets/images/dkumlook-logo.jpg';

  config!: Config;

  constructor(
    private productService: ProductScreenService,
    private translate: TranslateService,
    private router: Router,
    private authService: AuthenticationService,
    public cartService: CartService,
    private globalService: GlobalVariablesService
    )
  {
    this.globalService.getConfig().subscribe({
      next: (response: Config)=> {
        this.config = response as Config;

        console.log("Config => ", this.config)
        if(this.config.snBgColor && this.config.bgColor){
          this.content_bgColor = this.config.bgColor;
        } else
        if(this.config.snBgImg && this.config.bgImgPath){
          this.content_bgImg = `url(${this.config.bgImgPath})`;
          console.log("Content bgimg => ", this.content_bgImg)
        }

        this.nav_bar_bgColor = this.config.bgHeaderColor;
        this.footer_bgColor = this.config.bgFooterColor;
        this.your_logo = this.config.logoImgUrl;
      },
      error: (error: any)=> {
        console.log("Error => ", error)
      }
    })
    //this.content_bgImg = "url('assets/images/background-moda.jpg')";
    this.selectedCategory = {categoryId: -1, categoryName: "Todas categorias"};
    let userLang = navigator.language;
    this.translate.setDefaultLang('pt-br');
    this.translate.use(localStorage.getItem('locale')?.toLocaleLowerCase() || userLang.toLowerCase());
    localStorage.setItem('locale', userLang.toLowerCase());
    this.isLoggedIn = this.authService.isAuthenticated();
    console.log("Logged in => ", this.isLoggedIn)
    this.calculateScreenWidth();
    this.getCategories();
  }

  ngOnInit(): void {
    this.current_route = '/product-list';
    this.router.navigate([this.current_route], {skipLocationChange: true, state: {categoryControl: this.categoryControl}});
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
    const currentScrollPosition = window.scrollY;

    // Verifica a direção do scroll
    this.isScrolledDown = currentScrollPosition > this.lastScrollPosition;

    // Atualiza a última posição de rolagem
    this.lastScrollPosition = currentScrollPosition;
    console.log("Scrooling")
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
    this.calculateScreenWidth();
  }

  showFooter(): boolean{
    return this.footer__routes.includes(this.current_route);
  }

  login(){
    if(!this.isLoggedIn){
      this.current_route = '/login';
      this.router.navigate([this.current_route], {skipLocationChange: true});
    } else {
      this.current_route = '/dashboard';
      this.router.navigate([this.current_route], {skipLocationChange: true});
    }
  }
}
