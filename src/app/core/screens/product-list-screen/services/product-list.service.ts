import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductTag } from '../models/product-tag.model';
import { environment } from 'src/enviroments/environment';
import { RequiredCart } from '../../cart-screen/models/client-order.model';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  constructor(private http: HttpClient) { }

  getProductsByCategories(): Observable<ProductTag[]> {
    return this.http.get<ProductTag[]>(`${environment.PATH_API}/product/products-by-categories`);
  }
  getCarts(): Observable<RequiredCart[]> {
    return this.http.get<RequiredCart[]>(`${environment.PATH_API}/orders`);
  }
}
