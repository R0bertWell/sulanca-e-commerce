import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {
      //console.log("Interceptor working !!!!")
     }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // add authorization header with jwt token if available
      let currentUser:any = this.authenticationService.currentUserValue;
      //console.log("Interceptado JWT ! => ", currentUser);

      if (currentUser && currentUser.jwt) {
          request = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${currentUser.jwt}`
              }
          });
      }

      console.log(request);
      return next.handle(request);
  }

}
