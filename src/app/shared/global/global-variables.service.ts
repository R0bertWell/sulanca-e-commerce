import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  constructor(public http: HttpClient) {
  }

  getServerSideUrl(): Observable<string> {
    return this.http.get('http://192.168.1.2:8080/getServerUrl', {responseType: 'text'});
  }
}
