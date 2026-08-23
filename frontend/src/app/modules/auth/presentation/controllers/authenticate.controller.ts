import { Injectable } from '@angular/core';
import { LoginRes } from '../../application/responses';
import { LoginUserPayload } from '../../application/payloads';
import { AuthenticateService } from '../../application/services';
import { Either } from '@eklipse/ng-utilities';

type Result = Either<string, LoginRes>;

@Injectable()
export class AuthenticateController {
  constructor(private _authenticate: AuthenticateService) {}

  public async loginUser(payload: LoginUserPayload): Promise<Result> {
    try {
      const result = await this._authenticate.loginUser(payload);
      return Either.right(result);
    } catch (error) {
      return Either.left(error);
    }
  }
}
