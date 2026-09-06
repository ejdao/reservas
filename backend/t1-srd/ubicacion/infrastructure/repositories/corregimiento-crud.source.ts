import { Injectable } from '@nestjs/common';
import { CorregimientoRes } from '@shared/ubicacion/application/responses';
import { CorregimientoOrm, DepartamentoOrm, MunicipioOrm } from '@orm/shared/ubicacion';
import { TYPE_ORM_UTILITIES } from '@common/application/services';
import { UBICACION_FACTORIES } from '../factories';
import { SharedBaseSource } from '@shared/common';

@Injectable()
export class CorregimientoCrudSource extends SharedBaseSource {
  public async fetch(municipioId: number, pattern: string): Promise<CorregimientoRes[]> {
    const corregimientoRp = this.conn.getRepository(CorregimientoOrm);
    const departamentoRp = this.conn.getRepository(DepartamentoOrm);
    const municipioRp = this.conn.getRepository(MunicipioOrm);

    const municipio = await municipioRp.findOne({ where: { id: municipioId } });
    const departamento = await departamentoRp.findOne({ where: { id: municipio.departamentoId } });

    const corregimientos = await corregimientoRp.find({
      where: pattern ? { municipioId, nombre: TYPE_ORM_UTILITIES.like(pattern) } : { municipioId },
      take: TYPE_ORM_UTILITIES.take(pattern),
    });

    return corregimientos.map(m =>
      UBICACION_FACTORIES.corregimientoOrmToRes(m, `${departamento.codigo}${municipio.codigo}`)
    );
  }
}
