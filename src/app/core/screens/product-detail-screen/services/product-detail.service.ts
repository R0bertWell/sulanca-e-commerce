import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../forms/product-screen/models/category.model';
import { Color, ProductInfo } from '../../forms/product-screen/models/product-info.model';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  //private apiLocalUrl = "http://localhost:8080"
  private apiLocalUrl = "http://192.168.1.2:8080"
  private apiUrlGetColors = '/product-infos/product/'; // URL do seu controlador Spring
  private apiUrlGetSizes = '/product-infos/product/'; // URL do seu controlador Spring


  constructor(private http: HttpClient) { }

  getColorsOfProduct(productId: number): Observable<any[]> {
    return this.http.get<Color[]>(this.apiLocalUrl + this.apiUrlGetColors + `${productId}/colors`);
  }

  getSizesOfProductByColor(productId: number, colorId: number): Observable<any[]> {
    return this.http.get<Color[]>(this.apiLocalUrl + `/product-infos/product/${productId}/color/${colorId}/sizes`);
  }

  getProductQuantByColorSize(productId: number, colorId: number, sizeId: number): Observable<number> {
    return this.http.get<number>(this.apiLocalUrl + `/product-infos/product/${productId}/color/${colorId}/size/${sizeId}/quantity`);
  }

  getProductInfos(productId: number, currentPage: number, pageSize: number) {
    return this.http.get<ProductInfo[]>(this.apiLocalUrl + `/product-infos/${productId}/product-infos?page=${currentPage}&size=${pageSize}`);
  }

  updateProductInfoQuantity(prodInfo: ProductInfo) {
    const productId = prodInfo.product.productId;
    const colorId = prodInfo.color.colorId;
    const sizeId = prodInfo.size.sizeId;
    const quantity = prodInfo.quantity;

    return this.http.put(this.apiLocalUrl + `/product-infos/info/product/${productId}/color/${colorId}/size/${sizeId}/update?quantity=${quantity}`, null);
  }

  deleteProductInfo(prodInfo: ProductInfo) {
    const productId = prodInfo.product.productId;
    const colorId = prodInfo.color.colorId;
    const sizeId = prodInfo.size.sizeId;

    return this.http.delete(this.apiLocalUrl + `/product-infos/info/product/${productId}/color/${colorId}/size/${sizeId}/delete`);
  }
}
