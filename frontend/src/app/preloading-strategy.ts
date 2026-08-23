import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { env } from '../../@environments/environment';
import { SessionStore } from '@stores/session';
import { ADMIN } from '@authorities';

@Injectable()
export class AppPreloadingStrategy implements PreloadingStrategy {
  constructor(private _sessionStore: SessionStore) {}

  preload(route: Route, load: () => Observable<any>) {
    if (env.production) {
      const authorities = this._sessionStore.wasLoaded()
        ? this._sessionStore.snapshot().authorities
        : [];

      if (route.data && route.data['authorities']) {
        const authoritiesRequired = [ADMIN, ...(route.data['authorities'] as string[])];

        const hasAuthority = () =>
          authoritiesRequired.some((authority: string) => authorities.includes(authority));

        if (hasAuthority()) return load();
        else return of(null);
      } else return of(null);
    } else return load();
  }
}
