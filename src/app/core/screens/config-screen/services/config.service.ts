import { Observable } from 'rxjs';
import { Config } from 'src/app/shared/models/config.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  updateConfig(config: Config): Observable<Config>{
    return this.http.put<Config>(environment.PATH_API + "/configs/update", config);
  }
}
