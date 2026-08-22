import { Between, In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DATE_UTILITIES } from '@common/application/services';
import { BaseSource } from '@common/infrastructure/services';
import { reservaOrmToFetchReservaRes } from '../factories';
import { UsuarioOrm } from '@orm/seguridad';
import { ReservaOrm } from '@orm/reservas';

@Injectable()
export class ReservaCrudSource extends BaseSource {
  async fetch(start: Date, end: Date) {
    const reservaRp = this.conn.getRepository(ReservaOrm);
    const usuRp = this.conn.getRepository(UsuarioOrm);

    const empresa = await this.getEnterprise();

    let me: UsuarioOrm;
    let recursosIds: number[];

    if (this.auth.isUsuario) {
      me = await usuRp.findOne({ where: { id: this.auth.id }, relations: ['recursos'] });
      recursosIds = me.recursos.filter(r => r.id && r.empresaId === empresa.id).map(r => r.id);
    }

    const dateRange = DATE_UTILITIES.rangeOneDay(start, end, 'add');

    const reservasRelations = ['servicio', 'pagos', 'servicio.costo'];
    if (this.auth.isUsuario) reservasRelations.push('cliente');
    if (this.auth.isCliente) reservasRelations.push('recurso');

    const reservas = await reservaRp.find({
      where: {
        empresa: { codigo: this.auth.enterpriseCode },
        fechaInicio: Between(dateRange.start, dateRange.end),
        clienteId: this.auth.isCliente ? this.auth.id : undefined,
        recursoId: this.auth.isCliente ? undefined : In(recursosIds),
      },
      relations: reservasRelations,
    });

    if (this.auth.isUsuario) {
      reservas.map(e => (e.recurso = me.recursos.filter(r => r.id === e.recursoId)[0]));
    }

    return reservas.map(r => reservaOrmToFetchReservaRes(r));
  }
}
