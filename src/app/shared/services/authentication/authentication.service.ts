import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/enviroments/environment';
import { User } from '../../models/user.model';
import { Authority } from '../../models/authority.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User | null>;

    public currentUser: Observable<User | null>;

    constructor(private http: HttpClient) {
      const currentStoredUser = localStorage.getItem('currentUser') || '';
      this.currentUserSubject = new BehaviorSubject<User | null>(currentStoredUser ? JSON.parse(currentStoredUser) : null);
      this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.getValue();
    }

    public get currentAuthorities(): Authority[] | [] {
      return this.currentUserSubject.getValue()?.authorities || [];
  }

    isAuthenticated(): boolean {
      console.log("Current use vlaue => ", this.currentUserValue)
      return this.currentUserValue != null;
    }

    isNormalUser(): boolean {
      const authorities: Authority[] = this.currentUserSubject.getValue()?.authorities || [];
      const userAuthority: string = "USER_ROLE";
      const isNormalUser = authorities.some(a => a.authority === userAuthority);
      return this.isAuthenticated() && isNormalUser;
    }

    login(username: string, password: string) {
      console.log(`Login => ${environment.PATH_API}/authentication` )
      return this.http.post<any>(`${environment.PATH_API}/authentication`, { username, password })
        .pipe(map(user => {
          console.log("Passou do login => ", user)
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    signUp(username: string, password: string) {
      console.log(`Login => ${environment.PATH_API}/sign-up` )
      return this.http.post<any>(`${environment.PATH_API}/sign-up`, { username, password })
        .pipe(map(user => {
            return user;
        }));
    }

    logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      localStorage.removeItem('username');
      this.currentUserSubject.next(null);
      location.reload();
    }

    //set name user new in storage
    setUserName(username:string){
      localStorage.setItem('username', JSON.stringify(username));
    }

    getUserName(){
      return JSON.parse(localStorage.getItem('username') || '');
    }
}
