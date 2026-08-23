import {
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  ApplicationConfig,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  withInMemoryScrolling,
  withViewTransitions,
  ViewTransitionInfo,
  withPreloading,
  provideRouter,
} from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppPreloadingStrategy } from './preloading-strategy';
import { routes } from './routes';
import {
  UnauthorizedInterceptor,
  AddTokenInterceptor,
  TimerInterceptor,
} from '@common/interceptors';

const ADMIN_AUTH_SEGMENTS = new Set(['admin', 'login', 'register', 'forgot-password']);

function getRouteSegments(snapshot: ActivatedRouteSnapshot): string[] {
  return snapshot.pathFromRoot.flatMap((route) =>
    route.url.map((segment) => segment.path).filter(Boolean),
  );
}

function shouldSkipTransitionForRoute(info: ViewTransitionInfo): boolean {
  const fromSegments = getRouteSegments(info.from);
  const toSegments = getRouteSegments(info.to);
  return [...fromSegments, ...toSegments].some((segment) => ADMIN_AUTH_SEGMENTS.has(segment));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideTanStackQuery(
      new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } }),
    ),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withPreloading(AppPreloadingStrategy),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withViewTransitions({
        onViewTransitionCreated: (info) => {
          if (shouldSkipTransitionForRoute(info)) info.transition.skipTransition?.();
        },
      }),
    ),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimerInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
};
