import { Injectable } from '@nestjs/common';
import { entidadOrmToRes, RecursoRes } from '@shared/common';
import { SharedBaseSource } from '@shared/common';
import { EpsOrm } from '@orm/shared';
import { TYPE_ORM_UTILITIES } from '@common/application/services';

@Injectable()
export class RecursosImpl extends SharedBaseSource {
  public async eps(pattern: string): Promise<RecursoRes[]> {
    const rp = this.conn.getRepository(EpsOrm);
    const e = await rp.find({
      where: { nombre: TYPE_ORM_UTILITIES.like(pattern) },
      take: TYPE_ORM_UTILITIES.take(pattern),
    });
    return e.map(d => entidadOrmToRes(d, false, { codigo: 'nit' }));
  }
}
