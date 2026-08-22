import * as jwt from 'jsonwebtoken';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JWT_SERVICES } from '@common/application/services';
import { UsuarioOrm, TokenOrm } from '@orm/seguridad';
import { ENVIRONMENTS } from 'src/app.environments';
import { switchConn } from 'src/app.connections';

@Injectable()
export class ActiveTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const token = context.switchToHttp().getRequest().headers.authorization.split(' ')[1];
      jwt.verify(token, ENVIRONMENTS.secretKey);
      const tkDcd = JWT_SERVICES.decode(token);
      const usuarioId = tkDcd.getId();
      const conn = switchConn(tkDcd.getContext());

      if (tkDcd.getIsUsuario()) {
        const usuarioRp = conn.getRepository(UsuarioOrm);
        const tokenRp = conn.getRepository(TokenOrm);
        const usuario = await usuarioRp.findOne({ where: { id: usuarioId } });
        const url = context.getArgs()[0].url;
        const isUpdatePassword = url.includes('auth/update-password') || url.includes('auth/data');
        const isPasswordReiniciada = (usuario as UsuarioOrm).isPasswordReiniciada;
        const tokenFromBBDD = await tokenRp.findOne({ where: { usuarioId } });
        if (tokenFromBBDD.token !== token) {
          throw new Error('Ya cerró sesión con este token');
        } else if (isPasswordReiniciada && !isUpdatePassword) {
          throw new Error('Debe cambiar la contraseña ya que fue reiniciada recientemente');
        }
      }
      return true;
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  }
}
