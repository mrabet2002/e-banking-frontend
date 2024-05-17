import {
  CanActivateFn,
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
// export const authenticationGuard: CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => {
//   if (Inject(AuthService).isAuth()) {
//     return true;
//   } else {
//     Inject(Router).navigate(['/auth/not-authenticated']);
//     return false;
//   }
// };

@Injectable({
  providedIn: 'root',
})
export class authenticationGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
