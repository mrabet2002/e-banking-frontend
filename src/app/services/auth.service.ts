import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { endpoints } from './endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public _user!: User;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }


  public login(credentials: { username: string, password: string }) {
    this.http.post(endpoints.login(), credentials).subscribe({
      next: (response: any) => {
        this.user = response.accessToken;
        this.router.navigate(['/accounts'])
      }
    });
  }

  public register(registerForm: {
    name: string,
    username: string,
    password: string
  }) {
    return this.http.post(endpoints.register(), registerForm);
  }

  public logout() {
    localStorage.removeItem('accessToken');
    this._user = {
      username: '',
      name: '',
      role: '',
    };
    this.router.navigate(['/login']);
  }

  public loadUser(accessToken: any): void {

  }

  set user(accessToken: any) {
    this.setUserFromToken(accessToken)
    localStorage.setItem('accessToken', accessToken);
  }

  get user(): User {
    let accessToken = localStorage?.getItem('accessToken') || null;
    this.setUserFromToken(accessToken)
    return this._user;
  }

  private setUserFromToken(accessToken: any) {
    if (accessToken) {
      let decodedJwt: any = jwtDecode(accessToken);
      this._user = {
        username: decodedJwt.sub,
        name: decodedJwt.name,
        role: decodedJwt.scope,
      };
    }
  }

  isAuthenticated() {
    return localStorage.getItem('accessToken')
  }

}
