import { Injectable } from '@nestjs/common';
import { FetchPermisoRes } from '@seg/application/responses';
import { STRING_UTILITIES } from '@common/application/services';
import { ModuloOrm, PermisoOrm, SubModuloOrm } from '@orm/seguridad';
import { CreatePermisoDto } from '@seg/application/dtos';
import { CTM_CONTEXTS_AUTHS_VALUES } from '@common/domain/types';
import { BaseSource } from '@common/infrastructure/services';

@Injectable()
export class PermisosCrudSource extends BaseSource {
  public async fetch(onlyCodigos: boolean): Promise<FetchPermisoRes> {
    try {
      const result = await this.fetchAuthorities(this.auth.context);
      return { permisos: onlyCodigos ? [] : result.permisos, onlyCodigos: result.onlyCodigos };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async create(body: CreatePermisoDto): Promise<boolean> {
    body.nombre = STRING_UTILITIES.upperCaseAndTrim(body.nombre);

    const moduloRp = this.conn.getRepository(ModuloOrm);
    const subModuloRp = this.conn.getRepository(SubModuloOrm);
    const permisoRp = this.conn.getRepository(PermisoOrm);
    const modulo = await moduloRp.findOne({ where: { codigo: body.moduloCode } });
    const subModulo = await subModuloRp.findOne({
      where: { moduloId: modulo.id, codigo: body.subModuloCode },
    });
    const permisoConMismoNombre = await permisoRp.find({
      where: { nombre: body.nombre, moduloId: modulo.id, subModuloId: subModulo.id },
    });
    if (permisoConMismoNombre.length) throw new Error('Ya existe un permiso con este nombre');

    let permisoForThisBBDD: PermisoOrm;
    for (let index = 0; index < CTM_CONTEXTS_AUTHS_VALUES.length; index++) {
      const ctx = CTM_CONTEXTS_AUTHS_VALUES[index];
      const qr = this.dynamicQR(ctx);
      await qr.connect();
      await qr.startTransaction();
      try {
        const lclModuloRp = this.conn.getRepository(ModuloOrm);
        const lclSubModuloRp = this.conn.getRepository(SubModuloOrm);
        const permisoRp = qr.manager.getRepository(PermisoOrm);

        const lclModulo = await lclModuloRp.findOne({ where: { codigo: modulo.codigo } });
        const lclSubModulo = await lclSubModuloRp.findOne({
          where: { codigo: subModulo.codigo, moduloId: lclModulo.id },
        });

        const ultimoPermiso = await permisoRp.find({
          where: { moduloId: lclModulo.id, subModuloId: lclSubModulo.id },
          order: { id: 'desc' },
          take: 1,
        });

        const newCodigo = ultimoPermiso.length ? +ultimoPermiso[0].codigo + 1 : 1;
        const zeros = newCodigo <= 9 ? '00' : newCodigo <= 99 ? '0' : '';

        const newPermiso = new PermisoOrm();
        newPermiso.codigo = `${zeros}${newCodigo}`;
        newPermiso.isActivo = ctx.getCode() === this.auth.context.getCode() ? true : false;
        newPermiso.moduloId = lclModulo.id;
        newPermiso.subModuloId = lclSubModulo.id;
        newPermiso.nombre = body.nombre;

        const stored = await permisoRp.save(newPermiso);

        if (ctx === this.auth.context) permisoForThisBBDD = stored;

        await qr.commitTransaction();
      } catch (error: any) {
        await qr.rollbackTransaction();
        throw new Error(`El registró falló en ${ctx.getCode()} (${error.message})`);
      } finally {
        await qr.release();
      }
    }
    return true;
  }
}
