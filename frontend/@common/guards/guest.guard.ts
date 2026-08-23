import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_URLS } from '../constants';
import { STORAGE_KEYS } from '../services';

export const GuestGuard = () => {
  const router = inject(Router);

  if (localStorage.getItem(STORAGE_KEYS.authToken) !== null) {
    router.navigate([LOCAL_URLS.home]);
    return false;
  }

  return true;
};
