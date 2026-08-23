import { GcmContextType } from '@common/types';
import { UserDataFromToken } from '@common/services';

export class TokCreAndExpInfo {
  constructor(
    private _createdAt: Date,
    private _expiredAt: Date,
  ) {}

  get createdAt(): Date {
    return this._createdAt;
  }

  get expiredAt(): Date {
    return this._expiredAt;
  }
}

export class Session {
  constructor(
    private _token: TokCreAndExpInfo,
    private _context: GcmContextType,
    private _user: UserDataFromToken,
    private _authorities: string[],
    private _wasLoaded: boolean,
  ) {}

  get token(): TokCreAndExpInfo {
    return this._token;
  }

  get context(): GcmContextType {
    return this._context;
  }

  get user(): UserDataFromToken {
    return this._user;
  }

  get authorities(): string[] {
    return this._authorities;
  }

  get wasLoaded(): boolean {
    return this._wasLoaded;
  }
}
