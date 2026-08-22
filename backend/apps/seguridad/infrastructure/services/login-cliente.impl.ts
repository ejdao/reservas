import { QueryRunner } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CTM_CONTEXTS, ctmContextTypeFactory } from '@common/domain/types';
import { LoginClienteDto } from '@seg/application/dtos';
import { LoginRes } from '@seg/application/responses';
import { switchConn } from 'src/app.connections';
import { EmpresaOrm } from '@orm/seguridad';
import { ClienteOrm } from '@orm/general';
import {
  decryptValueFromFront,
  JWT_SERVICES,
  RSA_SERVICES,
  STRING_UTILITIES,
} from '@common/application/services';

@Injectable()
export class LoginClienteImpl {
  public async execute(payload: LoginClienteDto): Promise<LoginRes> {
    if (!payload.contextCode) payload.contextCode = CTM_CONTEXTS.DEFAULT.getCode();
    else payload.contextCode = decryptValueFromFront(payload.contextCode);
    payload.email = STRING_UTILITIES.lowerCaseAndTrim(decryptValueFromFront(payload.email));
    payload.enterpriseCode = STRING_UTILITIES.trim(decryptValueFromFront(payload.enterpriseCode));
    payload.fullName = STRING_UTILITIES.upperCaseAndTrim(decryptValueFromFront(payload.fullName));
    payload.phoneNumber = STRING_UTILITIES.trim(decryptValueFromFront(payload.phoneNumber));

    const ctx = ctmContextTypeFactory(payload.contextCode);

    let qr: QueryRunner;

    try {
      const conn = switchConn(ctx);
      qr = conn.createQueryRunner();

      await qr.connect();

      await qr.startTransaction();

      const empresaRp = qr.manager.getRepository(EmpresaOrm);
      const clienteRp = qr.manager.getRepository(ClienteOrm);

      const empresa = await empresaRp.findOne({ where: { codigo: payload.enterpriseCode } });

      if (!empresa) throw new Error('Esta empresa no existe');

      let cliente = await clienteRp.findOne({
        where: [
          { numeroContacto: payload.phoneNumber, empresaId: empresa.id },
          { email: payload.email, empresaId: empresa.id },
        ],
      });

      if (!cliente) {
        cliente = new ClienteOrm();
        cliente.empresaId = empresa.id;
        cliente.email = payload.email;
        cliente.numeroContacto = payload.phoneNumber;
        cliente.nombreCompleto = payload.fullName;
        cliente = await clienteRp.save(cliente);
      }

      const token = JWT_SERVICES.generate({
        usuarioId: cliente.id,
        empresaCode: empresa.codigo,
        nombreCompleto: `${cliente.nombreCompleto}`,
        isPasswordReiniciada: false,
        documento: cliente.numeroContacto,
        tablePath: 'CLIENTE',
        context: ctx,
        expiresIn: '3h',
      });

      await qr.commitTransaction();

      return { token: RSA_SERVICES.encryptValue(token) };
    } catch (error: any) {
      if (qr) await qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      if (qr) await qr.release();
    }
  }
}
