import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../shared/services/authentication/authentication.service';

export const authGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);



  if (authService.currentUserValue) {
    return true;
  }

  // Redirect to the login page
  return router.parseUrl(`/login?returnUrl=${router.url}`);
};
