import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Color } from '../../product-screen/models/product-info.model';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private apiLocalUrl = environment.PATH_API;
  private apiUrlAddColor = '/product-infos/color/save';


  constructor(public httpReq: HttpClient) { }

  getColors(currentPage: number, pageSize: number, filter: string): Observable<Color[]> {
    filter = filter || '';
    return this.httpReq.get<Color[]>(this.apiLocalUrl + `/colors/list?filter=${filter}&page=${currentPage}&size=${pageSize}`);
  }

  saveColor(color: Color): Observable<any> {
    return this.httpReq.post<any>(this.apiLocalUrl + this.apiUrlAddColor,
      color);
  }

  removeColor(colorId: number) {
    return this.httpReq.delete<any>(this.apiLocalUrl + `/colors/color/${colorId}/delete`);
  }
}
