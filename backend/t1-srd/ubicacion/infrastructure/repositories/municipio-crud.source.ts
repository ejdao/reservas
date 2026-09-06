import { Injectable } from '@nestjs/common';
import { MunicipioRes } from '@shared/ubicacion/application/responses';
import { DepartamentoOrm, MunicipioOrm } from '@orm/shared/ubicacion';
import { TYPE_ORM_UTILITIES } from '@common/application/services';
import { SharedBaseSource } from '@shared/common';
import { UBICACION_FACTORIES } from '../factories';

@Injectable()
export class MunicipioCrudSource extends SharedBaseSource {
  public async fetch(
    departamentoId: number,
    pattern: string,
    payload: { addCorregimientos: boolean }
  ): Promise<MunicipioRes[]> {
    const relations = [];
    if (payload.addCorregimientos) relations.push('corregimientos');
    const departamentoRp = this.conn.getRepository(DepartamentoOrm);
    const municipioRp = this.conn.getRepository(MunicipioOrm);

    const departamento = await departamentoRp.findOne({ where: { id: departamentoId } });

    const municipios = await municipioRp.find({
      where: pattern
        ? { departamentoId, nombre: TYPE_ORM_UTILITIES.like(pattern) }
        : { departamentoId },
      relations,
      take: TYPE_ORM_UTILITIES.take(pattern),
    });

    return municipios.map(m => UBICACION_FACTORIES.municipioOrmToRes(m, departamento.codigo));
  }
}
