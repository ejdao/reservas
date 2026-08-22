import { Injectable } from '@nestjs/common';
import { DATE_UTILITIES } from '@common/application/services';
import { BaseSource } from '@common/infrastructure/services';
import { HorarioOrm } from '@orm/reservas';

@Injectable()
export class ReservaSource extends BaseSource {
  protected workAtDay(day: Date, h: HorarioOrm) {
    const dayForHumans = DATE_UTILITIES.dayForHumans(day);
    return {
      workToday: h[`workOn${dayForHumans}`],
      start: DATE_UTILITIES.parseMinutesToDate(day, h[`horaInicio${dayForHumans}`]),
      end: DATE_UTILITIES.parseMinutesToDate(day, h[`horaFinal${dayForHumans}`]),
    };
  }
}
