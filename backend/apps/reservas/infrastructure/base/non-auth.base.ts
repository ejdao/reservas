import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DATE_UTILITIES } from '@common/application/services';
import { EmpresaOrm } from '@orm/seguridad';
import { HorarioOrm } from '@orm/reservas';

@Injectable()
export class ReservaNonAuthSource {
  protected workAtDay(day: Date, h: HorarioOrm) {
    const dayForHumans = DATE_UTILITIES.dayForHumans(day);
    return {
      workToday: h[`workOn${dayForHumans}`],
      start: DATE_UTILITIES.parseMinutesToDate(day, h[`horaInicio${dayForHumans}`]),
      end: DATE_UTILITIES.parseMinutesToDate(day, h[`horaFinal${dayForHumans}`]),
    };
  }

  protected async getEnterprise(conn: DataSource, enterpriseCode: string, relations?: string[]) {
    const empresaRp = conn.getRepository(EmpresaOrm);
    const empresa = await empresaRp.findOne({ where: { codigo: enterpriseCode }, relations });
    return empresa;
  }
}
