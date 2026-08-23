import { Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { SessionStore } from '@stores/session';
import { clearLocalStorage } from '../services';
import { LOCAL_URLS } from '../constants';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const router = inject(Router);
    const sessionStore = inject(SessionStore);

    return next.handle(req).pipe(
      catchError((err) => {
        if ([401].indexOf(err.status) !== -1) {
          if (!location.href.includes(LOCAL_URLS.login)) {
            clearLocalStorage();
            sessionStore.clear();
            router.navigate([LOCAL_URLS.login]);
          }
        }
        return throwError(() => err);
      }),
    );
  }
}
