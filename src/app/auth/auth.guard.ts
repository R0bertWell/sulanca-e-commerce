import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { Authority } from '../shared/models/authority.model';

export const authGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.currentUserValue) {
    return true;
  }

  // Redirect to the login page
  return router.parseUrl(`/login?returnUrl=${router.url}`);
};

export const adminAuthGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);


  if (authService.currentUserValue) {
    const adminAuthority: Authority = {authority: "ADMIN_ROLE"};
    const authorities: Authority[] = authService.currentAuthorities;
    return authorities != undefined && authorities.length > 0 && authorities.includes(adminAuthority);
  }

  // Redirect to the login page
  return router.parseUrl(`/login?returnUrl=${router.url}`);
};

export const specialAuthGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);


  if (authService.currentUserValue) {
    const adminAuthority: Authority = {authority: "SPECIAL_ROLE"};
    const authorities: Authority[] = authService.currentAuthorities;
    console.log("Tem a role Especial ? => ", authorities)
    console.log("Special role => ", adminAuthority)
    return authorities != undefined && authorities.length > 0 && authorities.includes(adminAuthority);
  }

  // Redirect to the login page
  return router.parseUrl(`/login?returnUrl=${router.url}`);
};
