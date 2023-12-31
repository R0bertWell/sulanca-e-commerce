import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiLocalUrl = environment.PATH_API;
  private apiUrlAddSize = '/categories/category/save';


  constructor(public httpReq: HttpClient) { }

  getCategories(currentPage: number, pageSize: number, filter: string): Observable<Category[]> {
    filter = filter || '';
    return this.httpReq.get<Category[]>(this.apiLocalUrl + `/categories/list?filter=${filter}&page=${currentPage}&size=${pageSize}`);
  }

  saveCategory(category: Category): Observable<any> {
    return this.httpReq.post<any>(this.apiLocalUrl + this.apiUrlAddSize,
      category);
  }

  removeCategory(categoryId: number) {
    return this.httpReq.delete<any>(this.apiLocalUrl + `/categories/category/${categoryId}/delete`);
  }

}
