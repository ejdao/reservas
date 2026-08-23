import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { env } from '../../@environments/environment';
import { SessionStore } from '@stores/session';
import { ADMIN } from '../../@authorities';
import { LOCAL_URLS } from '../constants';

const _validateAuthorities = (
  authorities: string[] | undefined,
  myAuthorities: string[],
): boolean => {
  if (authorities) {
    let canActivate = false;

    authorities.map((authority) => {
      if (myAuthorities.indexOf(authority) >= 0) canActivate = true;
    });

    return canActivate;
  } else {
    return true;
  }
};

let isNotFirstCharge = false;

export const AuthoritiesGuard = (route: ActivatedRouteSnapshot) => {
  if (location.href === `${env.serveHost}/#/${LOCAL_URLS.home}` || isNotFirstCharge) {
    isNotFirstCharge = true;
    const router = inject(Router);
    const sessionStore = inject(SessionStore);
    let myAuthorities: string[] = [];

    if (env.production) {
      if (sessionStore.wasLoaded()) myAuthorities = sessionStore.snapshot().authorities;
    } else myAuthorities.push(ADMIN);

    const requiredAuthorities = route.data!['authorities']
      ? [ADMIN, ...route.data['authorities']]
      : undefined;

    const canActivate = _validateAuthorities(requiredAuthorities, myAuthorities);

    if (!canActivate) router.navigate([LOCAL_URLS.home]);
    return canActivate;
  } else {
    setTimeout(() => {
      isNotFirstCharge = true;
    });
    return true;
  }
};
