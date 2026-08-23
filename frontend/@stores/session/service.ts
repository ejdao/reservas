import { firstValueFrom, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { decodeToken, STORAGE_KEYS, UserDataFromToken } from '@common/services';
import { gcmContextTypeFactory } from '@common/types';
import { env } from '../../@environments/environment';
import { Session, TokCreAndExpInfo } from './entity';
import { sessionInitialState } from './store';
import { SEG_END_POINTS } from '@end-points';
import { ADMIN } from '@authorities';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly _state = signal<Session>(sessionInitialState);
  readonly state: Signal<Session> = this._state.asReadonly();
  readonly wasLoaded = computed(() => this.state().wasLoaded);

  constructor(private _http: HttpClient) {}

  public dispatch(session: { token: string; authorities: string[] }): void {
    const tkDcd = decodeToken(session.token);

    const newSession = new Session(
      new TokCreAndExpInfo(tkDcd.createdAt, tkDcd.expiredAt),
      gcmContextTypeFactory(tkDcd.context.getCode()),
      new UserDataFromToken(
        tkDcd.user.id,
        tkDcd.user.document,
        tkDcd.user.fullName,
        tkDcd.user.passIsReset,
      ),
      session.authorities,
      true,
    );

    this._state.set(newSession);
  }

  public clear(): void {
    this._state.set(sessionInitialState);
  }

  public snapshot(): Session {
    return this.state();
  }

  public hasAuthority(authorities: string[] = []): boolean {
    if (!authorities.length) return true;
    return authorities.some((authority) => this.state().authorities.includes(authority));
  }

  public async autoInstance(): Promise<void> {
    if (this.wasLoaded()) return;

    try {
      const token = localStorage.getItem(STORAGE_KEYS.authToken) || '';
      let authorities: string[] = [];

      if (env.production) authorities = await this._fetchMyAuthorities();
      else authorities.push(ADMIN);

      this.dispatch({ token, authorities });
    } catch (error: any) {
      console.warn('No se obtuvieron los permisos correctamente', error.message);
    }
  }

  private _fetchMyAuthorities(): Promise<string[]> {
    return firstValueFrom(
      this._http
        .get<{
          onlyCodigos: string[];
        }>(`${SEG_END_POINTS.permisos}`, { params: { onlyCodigos: true } })
        .pipe(
          map((data) => {
            return [...data.onlyCodigos];
          }),
        ),
    );
  }
}
