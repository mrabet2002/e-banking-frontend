import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {Router} from "@angular/router";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  let accessToken = localStorage.getItem('accessToken')
  // navigate to login page if user is not authenticated
  const router = inject(Router)
  if (!accessToken) {
    router.navigate(['/login'])
    return next(req);
  }

  const excludedEndpoints = ['login', 'register'];

  const isExcluded = excludedEndpoints.some((endpoint) =>
    req.url.includes(endpoint)
  );

  if (isExcluded) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return next(authReq);
};

