import { Injectable } from '@angular/core';
import { Cart, RequiredCart } from '../models/client-order.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  saveOrder(cart: Cart): Observable<RequiredCart> {
    return this.http.post<RequiredCart>(`${environment.PATH_API}/orders/order/save`, cart);
  }

  updatePayedOrder(orderId: number, payed: boolean): Observable<any> {
    return this.http.put<any>(`${environment.PATH_API}/orders/order/${orderId}/update-payed?payed=${payed}`, {});
  }

  updateSentOrder(orderId: number, sent: boolean): Observable<any> {
    return this.http.put<any>(`${environment.PATH_API}/orders/order/${orderId}/update-sent?sent=${sent}`, {});
  }

  getOrders(currentPage: number, pageSize: number): Observable<RequiredCart[]>  {
    return this.http.get<RequiredCart[]>(`${environment.PATH_API}/orders?page=${currentPage}&size=${pageSize}`);
  }

}
