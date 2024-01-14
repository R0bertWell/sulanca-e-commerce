import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/enviroments/environment';
import { User } from '../../models/user.model';

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

    isAuthenticated(): boolean {
      console.log("Current use vlaue => ", this.currentUserValue)
      return this.currentUserValue != null;
    }

    login(username: string, password: string) {
      console.log(`Login => ${environment.PATH_API}/authentication` )
      return this.http.post<any>(`http://192.168.1.23:8080/authentication`, { username, password })
        .pipe(map(user => {
          console.log("Passou do login => ", user)
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      localStorage.removeItem('username');
      this.currentUserSubject.next(null);
    }

    //set name user new in storage
    setUserName(username:string){
      localStorage.setItem('username', JSON.stringify(username));
    }

    getUserName(){
      return JSON.parse(localStorage.getItem('username') || '');
    }
}
