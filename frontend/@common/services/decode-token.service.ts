import { GcmContextCode, GcmContextType, gcmContextTypeFactory } from '@common/types';
import { jwtDecode } from 'jwt-decode';

export const STORAGE_KEYS = {
  authToken: 'ekl-token',
};

export const PROTECTED_STORAGE_KEYS = [];

interface AuthTokenI {
  jti: string;
  sub: string;
  fnm: string;
  iss: GcmContextCode;
  rst: boolean;
  iat: number;
  exp: number;
}

export class UserDataFromToken {
  constructor(
    private _id: string,
    private _document: string,
    private _fullName: string,
    private _passIsReset: boolean,
  ) {}

  get id(): string {
    return this._id;
  }

  get document(): string {
    return this._document;
  }

  get fullName(): string {
    return this._fullName;
  }

  get passIsReset(): boolean {
    return this._passIsReset;
  }
}

export class TokenDecoded {
  constructor(
    private _user: UserDataFromToken,
    private _context: GcmContextType,
    private _createdAt: Date,
    private _expiredAt: Date,
  ) {}

  get user(): UserDataFromToken {
    return this._user;
  }

  get context(): GcmContextType {
    return this._context;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get expiredAt(): Date {
    return this._expiredAt;
  }
}

const tokenDateToDate = (date: number): Date => {
  const _ = new Date(0);
  return new Date(_.setUTCSeconds(date));
};

export const decodeToken = (
  token: string = localStorage.getItem(STORAGE_KEYS.authToken)!,
): TokenDecoded => {
  try {
    const tkDcd: AuthTokenI = jwtDecode(token);

    return new TokenDecoded(
      new UserDataFromToken(tkDcd.jti, tkDcd.sub, tkDcd.fnm, tkDcd.rst),
      gcmContextTypeFactory(tkDcd.iss),
      tokenDateToDate(tkDcd.iat),
      tokenDateToDate(tkDcd.exp),
    );
  } catch (error) {
    throw new Error('Token not found or invalid');
  }
};

export const clearLocalStorage = (except: string[] = []) => {
  const toDelete: string[] = [];

  for (let i = 0, length = localStorage.length; i < length; i++) {
    const storageKey = localStorage.key(i) || '';

    if ([...PROTECTED_STORAGE_KEYS, ...except].indexOf(storageKey) < 0) toDelete.push(storageKey);
  }

  toDelete.forEach((td) => {
    localStorage.removeItem(td);
  });
};
