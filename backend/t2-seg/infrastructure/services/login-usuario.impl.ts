import { QueryRunner } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ESTADO_USUARIO, estadoUsuarioTypeFactory } from '@ctypes/general/usuario';
import { FetchEnterprisesDto, LoginUsuarioDto } from '@seg/application/dtos';
import { CTM_CONTEXTS, ctmContextTypeFactory } from '@common/domain/types';
import { FetchEnterprisesRes, LoginRes } from '@seg/application/responses';
import { UsuarioOrm, EmpresaOrm, TokenOrm } from '@orm/seguridad';
import { switchConn } from '@connections';
import { CYPTO_SERVICES, decryptValueFromFront, JWT_SERVICES } from '@common/application/services';

@Injectable()
export class LoginUsuarioImpl {
  public async fetchEnterprises(payload: FetchEnterprisesDto): Promise<FetchEnterprisesRes[]> {
    if (!payload.contextCode) payload.contextCode = CTM_CONTEXTS.DEFAULT.getCode();
    else payload.contextCode = decryptValueFromFront(payload.contextCode);
    payload.password = decryptValueFromFront(payload.password);
    payload.username = decryptValueFromFront(payload.username);

    const wrongCredentialsMsg = 'Usuario y/o clave incorrecta';

    const ctx = ctmContextTypeFactory(payload.contextCode);

    let qr: QueryRunner;

    try {
      const conn = switchConn(ctx);
      qr = conn.createQueryRunner();

      await qr.connect();

      await qr.startTransaction();

      const usuarioRp = qr.manager.getRepository(UsuarioOrm);

      const usuario = await usuarioRp.findOne({
        where: [{ documento: payload.username }, { email: payload.username }],
        select: {
          id: true,
          password: true,
          documento: true,
          ultimoAcceso: true,
          estadoCode: true,
          isPasswordReiniciada: true,
        },
        relations: ['empresas'],
      });

      if (!usuario) throw new Error(wrongCredentialsMsg);

      const userStatus = estadoUsuarioTypeFactory(usuario.estadoCode);

      if (userStatus !== ESTADO_USUARIO.ACTIVO) {
        throw new Error(`Su usuario está en estado ${userStatus.getForHumans()}`);
      }

      const matchingPasswords = await CYPTO_SERVICES.compare(payload.password, usuario.password);

      if (matchingPasswords) {
        return usuario.empresas.map(e => {
          const n = new FetchEnterprisesRes();
          n.codigo = e.codigo;
          n.nombre = e.nombre;
          return n;
        });
      } else {
        throw new Error(wrongCredentialsMsg);
      }
    } catch (error: any) {
      if (qr) await qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      if (qr) await qr.release();
    }
  }

  public async execute(payload: LoginUsuarioDto): Promise<LoginRes> {
    if (!payload.contextCode) payload.contextCode = CTM_CONTEXTS.DEFAULT.getCode();
    else payload.contextCode = decryptValueFromFront(payload.contextCode);
    payload.password = decryptValueFromFront(payload.password);
    payload.username = decryptValueFromFront(payload.username);
    payload.enterpriseCode = decryptValueFromFront(payload.enterpriseCode);

    const wrongCredentialsMsg = 'Usuario y/o clave incorrecta';

    const { username, password } = payload;
    const ctx = ctmContextTypeFactory(payload.contextCode);

    let qr: QueryRunner;

    try {
      const conn = switchConn(ctx);
      qr = conn.createQueryRunner();

      await qr.connect();

      await qr.startTransaction();

      const empresaRp = qr.manager.getRepository(EmpresaOrm);
      const usuarioRp = qr.manager.getRepository(UsuarioOrm);
      const tokenRp = qr.manager.getRepository(TokenOrm);

      const empresa = await empresaRp.findOne({ where: { codigo: payload.enterpriseCode } });

      if (!empresa) throw new Error('Esta empresa no existe');

      const usuario = await usuarioRp.findOne({
        where: [{ documento: username }, { email: username }],
        select: {
          id: true,
          password: true,
          documento: true,
          ultimoAcceso: true,
          estadoCode: true,
          isPasswordReiniciada: true,
          primerNombre: true,
          primerApellido: true,
        },
      });

      if (!usuario) throw new Error(wrongCredentialsMsg);

      const userStatus = estadoUsuarioTypeFactory(usuario.estadoCode);

      if (userStatus !== ESTADO_USUARIO.ACTIVO) {
        throw new Error(`Su usuario está en estado ${userStatus.getForHumans()}`);
      }

      const matchingPasswords = await CYPTO_SERVICES.compare(password, usuario.password);

      if (matchingPasswords) {
        const token = JWT_SERVICES.generate({
          usuarioId: usuario.id,
          empresaCode: empresa.codigo,
          nombreCompleto: `${usuario.primerNombre} ${usuario.primerApellido}`,
          isPasswordReiniciada: usuario.isPasswordReiniciada,
          documento: usuario.documento,
          tablePath: 'USUARIO',
          context: ctx,
          expiresIn: '7d',
        });

        usuario.ultimoAcceso = new Date();
        await usuarioRp.save(usuario);

        let newToken: TokenOrm;
        newToken = await tokenRp.findOne({ where: { usuarioId: usuario.id } });
        if (!newToken) {
          newToken = new TokenOrm();
          newToken.usuarioId = usuario.id;
        }
        newToken.token = token;
        newToken.ultimoAcceso = new Date();
        await tokenRp.save(newToken);

        await qr.commitTransaction();

        return { token: newToken.token };
      } else {
        throw new Error(wrongCredentialsMsg);
      }
    } catch (error: any) {
      if (qr) await qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      if (qr) await qr.release();
    }
  }
}
