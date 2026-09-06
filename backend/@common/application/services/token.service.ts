import { CtmContextCode, CtmContextType, ctmContextTypeFactory } from '@common/domain/types';
import { ENVIRONMENTS } from '@environments';
import { RSA_SERVICES } from './rsa.service';
import { jwtDecode } from 'jwt-decode';
import * as jwt from 'jsonwebtoken';
import { AuthTablePath } from '../types';
import { StringValue } from 'ms';

export class AuthToken {
  jti: string;
  sub: string;
  fnm: string;
  aud: string;
  iss: CtmContextCode;
  rst: boolean;
  tbp: AuthTablePath;
  iat?: number;
  exp?: number;
}

export class AuthTokenDecoded {
  constructor(
    private id: number,
    private enterpriseCode: string,
    private tablePath: AuthTablePath,
    private document: string,
    private context: CtmContextType,
    private createdAt: Date,
    private expiredAt: Date
  ) {}

  getId(): number {
    return this.id;
  }

  getEnterpriseCode(): string {
    return this.enterpriseCode;
  }

  getDocument(): string {
    return this.document;
  }

  getContext(): CtmContextType {
    return this.context;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getExpiredAt(): Date {
    return this.expiredAt;
  }

  getIsUsuario(): boolean {
    return this.tablePath === 'USUARIO';
  }

  getIsCliente(): boolean {
    return this.tablePath === 'CLIENTE';
  }
}

const _tokenDateToDate = (date: number): Date => {
  const el = new Date(0);
  return new Date(el.setUTCSeconds(date));
};

const decode = (token: string): AuthTokenDecoded => {
  try {
    const tokDecoded: AuthToken = jwtDecode(token);

    return new AuthTokenDecoded(
      +RSA_SERVICES.decryptValue(tokDecoded.jti),
      tokDecoded.aud,
      tokDecoded.tbp,
      tokDecoded.sub,
      ctmContextTypeFactory(tokDecoded.iss),
      _tokenDateToDate(tokDecoded.iat),
      _tokenDateToDate(tokDecoded.exp)
    );
  } catch (error: any) {
    throw new Error('Token not found or invalid');
  }
};

export const generate = (pl: {
  usuarioId: number;
  empresaCode: string;
  nombreCompleto: string;
  isPasswordReiniciada: boolean;
  documento: string;
  tablePath: AuthTablePath;
  context: CtmContextType;
  expiresIn: StringValue | number;
}) => {
  const payload: AuthToken = {
    jti: RSA_SERVICES.encryptValue(pl.usuarioId),
    aud: pl.empresaCode,
    fnm: pl.nombreCompleto,
    rst: pl.isPasswordReiniciada,
    sub: pl.documento,
    tbp: pl.tablePath,
    iss: pl.context.getCode(),
  };

  return jwt.sign(payload, ENVIRONMENTS.secretKey, { expiresIn: pl.expiresIn, algorithm: 'HS512' });
};

export const JWT_SERVICES = {
  decode,
  generate,
};
