import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

  get user() {
    return this.authService.user;
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
