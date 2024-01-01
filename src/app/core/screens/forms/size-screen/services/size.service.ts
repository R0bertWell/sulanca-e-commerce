import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size } from '../models/size.model';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private apiLocalUrl = environment.PATH_API;
  private apiUrlAddSize = '/sizes/size/save';


  constructor(public httpReq: HttpClient) { }

  getSizes(currentPage: number, pageSize: number, filter: string): Observable<Size[]> {
    filter = filter || '';
    return this.httpReq.get<Size[]>(this.apiLocalUrl + `/sizes/list?filter=${filter}&page=${currentPage}&size=${pageSize}`);
  }

  saveSize(size: Size): Observable<any> {
    return this.httpReq.post<any>(this.apiLocalUrl + this.apiUrlAddSize,
      size);
  }

  removeSize(sizeId: number) {
    return this.httpReq.delete<any>(this.apiLocalUrl + `/sizes/size/${sizeId}/delete`);
  }
}
