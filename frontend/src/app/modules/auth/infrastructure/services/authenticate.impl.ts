import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticateService } from '../../application/services';
import { LoginUserPayload } from '../../application/payloads';
import { LoginRes } from '../../application/responses';
import { SEG_END_POINTS } from '@end-points';

@Injectable()
export class AuthenticateImpl implements AuthenticateService {
  constructor(private _http: HttpClient) {}

  public async loginUser(payload: LoginUserPayload): Promise<LoginRes> {
    return firstValueFrom(
      this._http.post<LoginRes>(`${SEG_END_POINTS.auth}/login`, {
        ...payload,
        enterpriseCode: 'EMPBYDEFTO',
      }),
    );
  }
}
