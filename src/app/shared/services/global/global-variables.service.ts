import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../models/config.model';
import { environment } from 'src/enviroments/environment';
import { LayoutConfig } from '../../models/layout-config.model';
import { PaymentConfig } from '../../models/payment-config.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  constructor(public http: HttpClient) {
  }

  updateConfig(config: Config): Observable<Config> {
    return this.http.put<Config>(`${environment.PATH_API}/configs/general-config/update`, config);
  }

  getConfig(): Observable<Config> {
    return this.http.get<Config>(environment.PATH_API + "/configs");
  }

  getLayoutConfig(): Observable<LayoutConfig> {
    return this.http.get<LayoutConfig>(environment.PATH_API + "/configs/layout-config");
  }

  getPaymentConfig(): Observable<PaymentConfig> {
    return this.http.get<PaymentConfig>(environment.PATH_API + "/configs/payment-config");
  }

  updateLayoutConfig(layoutConfig: LayoutConfig): Observable<LayoutConfig> {
    return this.http.put<LayoutConfig>(environment.PATH_API + "/configs/layout-config/update", layoutConfig);
  }

  updatePaymentConfig(paymentConfig: PaymentConfig): Observable<PaymentConfig> {
    return this.http.put<PaymentConfig>(environment.PATH_API + "/configs/payment-config/update", paymentConfig);
  }
}
