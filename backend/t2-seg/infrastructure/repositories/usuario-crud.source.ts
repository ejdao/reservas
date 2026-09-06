import { In, Not } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseSource } from '@common/infrastructure/services';
import { CYPTO_SERVICES, RSA_SERVICES, STRING_UTILITIES } from '@common/application/services';
import { CreateUsuarioRes, FetchUsuarioRes } from '@seg/application/responses';
import { CreateUsuarioDto, UpdateUsuarioDto } from '@seg/application/dtos';
import { usuarioOrmToUsuarioResFactory } from '../factories';
import { UsuarioOrm, TokenOrm } from '@orm/seguridad';
import { TRANSACCIONES } from '@transactions';
import {
  ESTADO_USUARIO,
  estadoUsuarioTypeFactory,
  tipoDocUsuarioTypeFactory,
} from '@ctypes/general/usuario';

@Injectable()
export class UsuarioCrudSource extends BaseSource {
  public async fetch(documento: string, isUpdatingUsers: boolean): Promise<FetchUsuarioRes[]> {
    const usuarioRp = this.conn.getRepository(UsuarioOrm);
    const usuarios = await usuarioRp.find({
      where: { documento, empresas: { codigo: this.auth.enterpriseCode } },
      relations: ['rol'],
    });
    if (documento && isUpdatingUsers && usuarios.length) {
      if (this.auth.id === usuarios[0].id) throw new Error('No puede modificar su propio usuario');
    }
    const res = usuarios.map(u => usuarioOrmToUsuarioResFactory(u));

    return res;
  }

  public async create(body: CreateUsuarioDto): Promise<CreateUsuarioRes> {
    try {
      await this.qr.connect();
      await this.qr.startTransaction();

      const rolIdDcd: number = +RSA_SERVICES.decryptValue(body.rolId);
      await this.verifyEntityExist('GENROL', rolIdDcd);

      const empresa = await this.getEnterprise();

      const usuarioRp = this.qr.manager.getRepository(UsuarioOrm);

      if (body.documento) {
        const usuarioWithSameDocumento = await usuarioRp.findOne({
          where: { documento: body.documento },
        });
        if (usuarioWithSameDocumento) throw new Error('Ya existe un usuario con este documento');
      }

      if (body.email) {
        const usuarioWithSameEmail = await usuarioRp.findOne({
          where: { email: body.email },
        });
        if (usuarioWithSameEmail) throw new Error('Ya existe un usuario con este email');
      }

      const newUsuario = new UsuarioOrm();
      newUsuario.rolId = rolIdDcd;
      newUsuario.primerNombre = STRING_UTILITIES.upperCaseAndTrim(body.primerNombre);
      newUsuario.primerApellido = STRING_UTILITIES.upperCaseAndTrim(body.primerApellido);
      newUsuario.segundoNombre = STRING_UTILITIES.upperCaseAndTrim(body.segundoNombre);
      newUsuario.segundoApellido = STRING_UTILITIES.upperCaseAndTrim(body.segundoApellido);
      newUsuario.tipoDocumentoCode = tipoDocUsuarioTypeFactory(body.tipoDocumentoCode).getCode();
      newUsuario.estadoCode = estadoUsuarioTypeFactory(body.estadoCode).getCode();
      newUsuario.documento = STRING_UTILITIES.trim(body.documento);
      newUsuario.numeroContactoPrincipal = STRING_UTILITIES.trim(body.numeroCelular);
      newUsuario.email = STRING_UTILITIES.lowerCaseAndTrim(body.email);
      newUsuario.password = await CYPTO_SERVICES.encrypt('123');
      newUsuario.isPasswordReiniciada = true;
      newUsuario.estadoCode = ESTADO_USUARIO.ACTIVO.getCode();

      const stored = await usuarioRp.save(newUsuario);

      await this.generateTransaccion(TRANSACCIONES.GEN.USUARIO.CREAR, stored.id, this.qr);

      await this.qr.commitTransaction();

      return { id: RSA_SERVICES.encryptValue(stored.id) };
    } catch (error: any) {
      await this.qr.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await this.qr.release();
    }
  }

  public async update(id: string, body: UpdateUsuarioDto): Promise<boolean> {
    try {
      await this.qr.connect();
      await this.qr.startTransaction();

      const usuarioIdDcd: number = +RSA_SERVICES.decryptValue(id);
      let rolIdDcd: number;

      if (this.auth.id === usuarioIdDcd) throw new Error('No puede actualizar su propio usuario');

      await this.verifyEntityExist('GENUSUARIO', usuarioIdDcd);

      if (body.rolId) {
        rolIdDcd = +RSA_SERVICES.decryptValue(body.rolId);
        await this.verifyEntityExist('GENROL', rolIdDcd);
      }

      const usuarioRp = this.qr.manager.getRepository(UsuarioOrm);
      const tokenRp = this.qr.manager.getRepository(TokenOrm);

      const usuario = await usuarioRp.findOne({
        where: { id: usuarioIdDcd, empresas: { codigo: this.auth.enterpriseCode } },
      });

      const token = await tokenRp.findOne({ where: { usuarioId: usuario.id } });

      const usuarioWithSameDocumento = await usuarioRp.findOne({
        where: { documento: body.documento, id: Not(In([usuarioIdDcd])) },
      });

      if (usuarioWithSameDocumento) throw new Error('Ya existe un usuario con este documento');

      const tipoDocumentoCode = body.tipoDocumentoCode
        ? tipoDocUsuarioTypeFactory(body.tipoDocumentoCode).getCode()
        : body.tipoDocumentoCode;

      const estadoCode = body.estadoCode
        ? estadoUsuarioTypeFactory(body.estadoCode).getCode()
        : body.estadoCode;

      const SU = STRING_UTILITIES;

      if (rolIdDcd) usuario.rolId = rolIdDcd;
      if (body.primerNombre !== undefined) {
        usuario.primerNombre = SU.upperCaseAndTrim(body.primerNombre);
      }
      if (body.primerApellido !== undefined) {
        usuario.primerApellido = SU.upperCaseAndTrim(body.primerApellido);
      }
      if (body.segundoNombre !== undefined) {
        usuario.segundoNombre = SU.upperCaseAndTrim(body.segundoNombre);
      }
      if (body.segundoApellido !== undefined) {
        usuario.segundoApellido = SU.upperCaseAndTrim(body.segundoApellido);
      }
      if (body.tipoDocumentoCode !== undefined) {
        usuario.tipoDocumentoCode = tipoDocumentoCode;
      }
      if (body.estadoCode !== undefined) {
        usuario.estadoCode = estadoCode;
      }
      if (body.documento !== undefined) {
        usuario.documento = SU.trim(body.documento);
      }
      if (body.numeroCelular !== undefined) {
        usuario.numeroContactoPrincipal = SU.trim(body.numeroCelular);
      }
      if (body.email !== undefined) {
        usuario.email = SU.lowerCaseAndTrim(body.email);
      }

      if (token && estadoCode !== ESTADO_USUARIO.ACTIVO.getCode()) {
        token.token = null;
        await tokenRp.save(token);
      }

      await usuarioRp.save(usuario);

      await this.generateTransaccion(TRANSACCIONES.GEN.USUARIO.MODIFICAR, usuario.id, this.qr);

      await this.qr.commitTransaction();

      return true;
    } catch (error: any) {
      await this.qr.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await this.qr.release();
    }
  }

  public async resetPassword(usuarioId: string): Promise<boolean> {
    try {
      await this.qr.connect();
      await this.qr.startTransaction();

      const usuarioIdDecoded = +RSA_SERVICES.decryptValue(usuarioId);

      await this.verifyEntityExist('GENUSUARIO', usuarioIdDecoded);

      const usuarioRp = this.qr.manager.getRepository(UsuarioOrm);
      const usuario = await usuarioRp.findOne({
        where: { id: usuarioIdDecoded, empresas: { codigo: this.auth.enterpriseCode } },
      });

      usuario.password = await CYPTO_SERVICES.encrypt('123');
      usuario.isPasswordReiniciada = true;
      await usuarioRp.save(usuario);

      await this.qr.commitTransaction();
      return true;
    } catch (error: any) {
      await this.qr.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await this.qr.release();
    }
  }
}
