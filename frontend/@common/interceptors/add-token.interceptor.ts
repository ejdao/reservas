import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../services';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {
  private identicaBaseUrl = 'https://190.248.148.50:13443/api';
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // No agregar token a peticiones de Identica
    if (req.url.startsWith(this.identicaBaseUrl)) {
      return next.handle(req);
    }

    const token = localStorage.getItem(STORAGE_KEYS.authToken);

    const headers: any = { Accept: 'Application/json' };

    if (token) headers.Authorization = `Bearer ${token}`;

    const httpHeaders = new HttpHeaders(headers);

    const authReq = req.clone({
      headers: httpHeaders,
    });
    return next.handle(authReq);
  }
}
