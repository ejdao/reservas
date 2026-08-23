import { Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { env } from '../../@environments/environment';

@Injectable()
export class TimerInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const start = performance.now();
    return next.handle(req).pipe(
      tap(() => {
        if (!env.production) {
          const time: number = performance.now() - start;

          let url = req.url;

          [3000].forEach((port) => {
            url = url.replace(`https://genericcompany.com:${port}/`, '/');
            url = url.replace(`http://localhost:${port}/`, '/');
          });

          if (time > 10) console.log(url, time.toFixed() + 'ms');
        }
      }),
    );
  }
}
