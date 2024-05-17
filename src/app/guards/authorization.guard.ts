import { CanActivateFn, CanActivate } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

// export const authorizationGuard: CanActivateFn = (route, state) => {
//   const authService = Inject('authService');
//   const router = Inject('router');

//   return true;
// };

@Injectable({
  providedIn: 'root',
})
export class authorizationGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let authorizated = false;
    if (!this.authService.isAuthenticated) {
      return false;
    } else {
      if (
        (route.data['role'] as Array<string>).includes(
          this.authService.user.role
        )
      ) {
        authorizated = true;
      }
    }

    if (!authorizated) {
      this.router.navigate(['/auth/not-authorized']);
    }

    return authorizated;
  }
}
