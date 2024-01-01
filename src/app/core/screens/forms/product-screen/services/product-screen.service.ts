import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { Category } from '../models/category.model';
import { Product, ProductRequired } from '../models/product.model';
import { Color, ProductInfo, Size } from '../models/product-info.model';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductScreenService {

  //private apiLocalUrl = "http://localhost:8080"
  private apiLocalUrl = environment.PATH_API;
  private apiUrlSaveCategory = '/categories/category/save'; // URL do seu controlador Spring
  private apiUrlList = '/categories/category/list'; // URL do seu controlador Spring
  private apiUrlProduct = '/product/list'; // URL do seu controlador Spring
  private apiUrlRemoveProduct = '/product/'; // URL do seu controlador Spring
  private apiUrlAdd = '/product/add'; // URL do seu controlador Spring
  private apiColor = '/product-infos/colors'
  private apiSize = '/product-infos/sizes'
  private apiUrlAddColor = '/colors/color/save'; // URL do seu controlador Spring
  private apiUrlAddSize = '/product-infos/size/save'; // URL do seu controlador Spring



  constructor(private http: HttpClient) { }

  saveCategory(category: Category): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiLocalUrl + this.apiUrlSaveCategory,
      category,
      { headers, observe: 'response' }
    );
  }

  getCategoriesByFilter(filter: string): Observable<any[]> {
    return this.http.get<Category[]>(this.apiLocalUrl + this.apiUrlList);
  }

  getProductsByFilter(currentPage: number, pageSize: number, filters: any): Observable<Product[]>{
    let categoryId: number | null = filters.categoryId && filters.categoryId != -1 ? filters.categoryId : -1;
    let product_search: string = filters.product_search || '';
    let inStock: boolean = filters.inStock != null ? filters.inStock : true;
    return this.http.get<Product[]>(this.apiLocalUrl + this.apiUrlProduct + `?page=${currentPage}&size=${pageSize}&categoryId=${categoryId}&search=${product_search}&inStock=${inStock}`);
  }

  saveProduct(product: Product): Observable<ProductRequired> {
    return this.http.post<ProductRequired>(this.apiLocalUrl + this.apiUrlAdd,
      product);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(this.apiLocalUrl + this.apiUrlRemoveProduct + `${productId}/remove`)
  }

  /** PRODUCT INFOS */

  getColors(): Observable<any[]> {
    return this.http.get<Color[]>(this.apiLocalUrl + this.apiColor);
  }

  getSizes(): Observable<any[]> {
    return this.http.get<Size[]>(this.apiLocalUrl + this.apiSize);
  }

  getProductImage(productId: number): Observable<string>{
    return this.http.get<string>(this.apiLocalUrl + `${productId}/image-path`);
  }

  saveColor(color: Color): Observable<any> {
    return this.http.post<any>(this.apiLocalUrl + this.apiUrlAddColor,
      color);
  }

  saveSize(size: Size): Observable<any> {
    return this.http.post<any>(this.apiLocalUrl + this.apiUrlAddSize,
      size);
  }

  saveProductInfos(productInfos: ProductInfo[]){
    return this.http.post<any>(this.apiLocalUrl + `/product-infos/infos/save`, productInfos);
  }

  saveProductImage(formData: FormData, productId: number): Observable<any> {
    return this.http.post(this.apiLocalUrl + `/product/${productId}/image/upload`, formData);
  }

  deleteImages(imagesToDelete: number[]){
    return this.http.delete<any>(this.apiLocalUrl + `/product/images/delete`, {body: imagesToDelete});
  }

  updateProductInStock(productId: number, inStock: boolean){
    return this.http.put<any>(this.apiLocalUrl + `/product/${productId}/update-stock?inStock=${inStock}`, {});
  }
}
