import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size } from '../models/size.model';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private apiLocalUrl = "http://192.168.1.2:8080";
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
