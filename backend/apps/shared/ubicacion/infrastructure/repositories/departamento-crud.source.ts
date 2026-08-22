import { Injectable } from '@nestjs/common';
import { DepartamentoRes } from '@shared/ubicacion/application/responses';
import { TYPE_ORM_UTILITIES } from '@common/application/services';
import { DepartamentoOrm } from '@orm/shared/ubicacion';
import { UBICACION_FACTORIES } from '../factories';
import { SharedBaseSource } from '@shared/common';

@Injectable()
export class DepartamentoCrudSource extends SharedBaseSource {
  public async fetch(
    paisId: number,
    pattern: string,
    payload: { addMunicipios: boolean; addCorregimientos: boolean }
  ): Promise<DepartamentoRes[]> {
    const relations = [];
    if (payload.addMunicipios) relations.push('municipios');
    if (payload.addCorregimientos) relations.push('municipios.corregimientos');

    const departamentoRp = this.conn.getRepository(DepartamentoOrm);

    const departamentos = await departamentoRp.find({
      where: pattern ? { paisId, nombre: TYPE_ORM_UTILITIES.like(pattern) } : { paisId },
      relations,
      take: TYPE_ORM_UTILITIES.take(pattern),
    });

    return departamentos.map(d => UBICACION_FACTORIES.departamentoOrmToRes(d, ''));
  }
}
