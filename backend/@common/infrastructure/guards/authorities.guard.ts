import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { fetchAuthorities, fetchAuthoritiesByUsuario } from '../services';
import { JWT_SERVICES } from '@common/application/services';
import { ADMIN_AUTHORITY } from '@authorities/general';

@Injectable()
export class AuthoritiesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorities = this.reflector.get<string[]>('authorities', context.getHandler());

    if (!authorities) return true;

    const token = context.switchToHttp().getRequest().headers.authorization.split(' ')[1];

    const tkDcd = JWT_SERVICES.decode(token);

    let userAuthorities: string[] = [];

    authorities.push(ADMIN_AUTHORITY);

    let allAuthsCodes: string[] = [];
    let ownAuthsCodes: string[] = [];

    if (tkDcd.getIsUsuario()) {
      const allAuths = await fetchAuthorities(tkDcd.getContext());
      const ownAuths = await fetchAuthoritiesByUsuario(tkDcd.getId(), tkDcd.getContext());
      allAuthsCodes = allAuths.onlyCodigos;
      ownAuthsCodes = ownAuths.onlyCodigos;
    }

    ownAuthsCodes.forEach(e => {
      if (allAuthsCodes.indexOf(e) >= 0) userAuthorities.push(e);
    });

    const hasAnyAuthority = () =>
      userAuthorities.some((authority: string) => authorities.includes(authority));

    return hasAnyAuthority();
  }
}
