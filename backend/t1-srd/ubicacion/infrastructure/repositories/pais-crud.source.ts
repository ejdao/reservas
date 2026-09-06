import { Injectable } from '@nestjs/common';
import { PaisRes } from '@shared/ubicacion/application/responses';
import { TYPE_ORM_UTILITIES } from '@common/application/services';
import { SharedBaseSource } from '@shared/common';
import { UBICACION_FACTORIES } from '../factories';
import { PaisOrm } from '@orm/shared/ubicacion';

@Injectable()
export class PaisCrudSource extends SharedBaseSource {
  public async fetch(
    pattern: string,
    payload: { addDepartamentos: boolean; addMunicipios: boolean; addCorregimientos: boolean }
  ): Promise<PaisRes[]> {
    const relations = [];
    if (payload.addDepartamentos) relations.push('departamentos');
    if (payload.addMunicipios) relations.push('departamentos.municipios');
    if (payload.addCorregimientos) relations.push('departamentos.municipios.corregimientos');

    const paisRp = this.conn.getRepository(PaisOrm);
    const paises = await paisRp.find({
      where: pattern ? { nombre: TYPE_ORM_UTILITIES.like(pattern) } : {},
      relations,
      take: TYPE_ORM_UTILITIES.take(pattern),
    });

    return paises.map(p => UBICACION_FACTORIES.paisOrmToRes(p));
  }
}
