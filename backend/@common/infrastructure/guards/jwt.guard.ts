import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ENVIRONMENTS } from 'src/app.environments';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const token = context.switchToHttp().getRequest().headers.authorization.split(' ')[1];
      jwt.verify(token, ENVIRONMENTS.secretKey);
      return true;
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  }
}
