import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStore } from '@stores/session';
import { STORAGE_KEYS } from '../services';
import { LOCAL_URLS } from '../constants';

export const AuthGuard = () => {
  const router = inject(Router);
  const sessionStore = inject(SessionStore);

  if (localStorage.getItem(STORAGE_KEYS.authToken) === null) {
    sessionStore.clear();
    router.navigate([LOCAL_URLS.login]);
    return false;
  }

  return true;
};
