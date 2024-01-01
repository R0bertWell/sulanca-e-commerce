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

}
