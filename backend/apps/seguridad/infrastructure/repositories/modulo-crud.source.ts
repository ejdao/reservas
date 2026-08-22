import { Injectable } from '@nestjs/common';
import { FetchModuloRes } from '@seg/application/responses';
import { RSA_SERVICES, STRING_UTILITIES } from '@common/application/services';
import { CreateModuloDto } from '@seg/application/dtos';
import { CTM_CONTEXTS_AUTHS_VALUES } from '@common/domain/types';
import { moduloOrmToFetchModuloResFactory } from '../factories';
import { BaseSource } from '@common/infrastructure/services';
import { ModuloOrm } from '@orm/seguridad';

@Injectable()
export class ModulosCrudSource extends BaseSource {
  public async fetch(): Promise<FetchModuloRes[]> {
    try {
      const moduloRp = this.conn.getRepository(ModuloOrm);
      let modulos = await moduloRp.find({ relations: ['subModulos'] });

      modulos.map(el => {
        el.subModulos = el.subModulos.filter(sm => sm.isActivo);
      });

      modulos = modulos.filter(el => el.isActivo);

      modulos.map(el => {
        el.subModulos.map(sm => {
          delete sm.isActivo;
          delete sm.moduloId;
          sm.id = RSA_SERVICES.encryptValue(sm.id) as any;
        });
        delete el.isActivo;
        el.id = RSA_SERVICES.encryptValue(el.id) as any;
      });

      return modulos.map(m => moduloOrmToFetchModuloResFactory(m));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async create(body: CreateModuloDto): Promise<boolean> {
    body.nombre = STRING_UTILITIES.upperCaseAndTrim(body.nombre);
    let moduloForThisBBDD: ModuloOrm;

    const moduloRp = this.conn.getRepository(ModuloOrm);
    const moduloConMismoNombre = await moduloRp.find({ where: { nombre: body.nombre } });
    if (moduloConMismoNombre.length) throw new Error('Ya existe un modulo con este nombre');
    const ultimoModulo = await moduloRp.find({ order: { id: 'desc' }, take: 1 });

    for (let index = 0; index < CTM_CONTEXTS_AUTHS_VALUES.length; index++) {
      const ctx = CTM_CONTEXTS_AUTHS_VALUES[index];
      const qr = this.dynamicQR(ctx);
      await qr.connect();
      await qr.startTransaction();
      try {
        const nextCodigo = ultimoModulo.length ? +ultimoModulo[0].codigo + 1 : 1;
        const codigoWithZeros = nextCodigo <= 9 ? '00' : nextCodigo <= 99 ? '0' : '';

        const newModulo = new ModuloOrm();
        newModulo.codigo = `${codigoWithZeros}${nextCodigo}`;
        newModulo.isActivo = true;
        newModulo.nombre = body.nombre;

        const stored = await moduloRp.save(newModulo);

        if (ctx === this.auth.context) moduloForThisBBDD = stored;

        await qr.commitTransaction();
      } catch (error: any) {
        await qr.rollbackTransaction();
        throw new Error(`El registró falló en ${ctx.getCode()}: ${error.message}`);
      } finally {
        await qr.release();
      }
    }

    return true;
  }
}
