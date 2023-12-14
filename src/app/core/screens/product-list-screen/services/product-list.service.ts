import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../forms/product-screen/models/category.model';
import { ProductTag } from '../models/product-tag.model';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  private apiLocalUrl = "http://192.168.1.2:8080"
  private apiUrlSaveCategory = '/category/save'; // URL do seu controlador Spring
  private apiUrlList = '/category/list'; // URL do seu controlador Spring
  private apiUrlProduct = '/product/list'; // URL do seu controlador Spring
  private apiUrlRemoveProduct = '/product/'; // URL do seu controlador Spring
  private apiUrlAdd = '/product/add'; // URL do seu controlador Spring
  private apiColor = '/product-infos/colors'
  private apiSize = '/product-infos/sizes'
  private apiUrlAddColor = '/product-infos/color/save'; // URL do seu controlador Spring
  private apiUrlAddSize = '/product-infos/size/save'; // URL do seu controlador Spring



  constructor(private http: HttpClient) { }

  getProductsByCategories(): Observable<ProductTag[]> {
    return this.http.get<ProductTag[]>(this.apiLocalUrl + `/product/products-by-categories`);
  }
}
