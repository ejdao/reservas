import { DATE_UTILITIES, DateRangeI } from '@common/application/services';
import { CtmContextCode, ctmContextTypeFactory } from '@common/domain/types';
import { HorarioOrm, RecursoOrm, ReservaOrm, ServicioOrm } from '@orm/reservas';
import { ESTADOS_RESERVA_VALIDOS_CODES } from '@ctypes/reservas';
import { dataToDisponibilidadRecursoRes } from '../factories';
import { BadRequestException } from '@nestjs/common';
import { switchConn } from 'src/app.connections';
import { EmpresaOrm } from '@orm/seguridad';
import { Between, In } from 'typeorm';
import { orderBy } from 'lodash';

export interface DataDisponibilidadI {
  horario: HorarioOrm;
  rango: { start: Date; end: Date };
  rangos: { start: Date; end: Date }[];
}

export const fetchDisponibilidadRecurso = async (
  contextCode: CtmContextCode,
  enterpriseCode: string,
  recursoId: number,
  servicioId: number,
  fecha: Date
) => {
  try {
    const context = ctmContextTypeFactory(contextCode);
    const conn = switchConn(context);
    const servicioRp = conn.getRepository(ServicioOrm);
    const recursoRp = conn.getRepository(RecursoOrm);
    const reservaRp = conn.getRepository(ReservaOrm);
    const empresaRp = conn.getRepository(EmpresaOrm);

    const empresa = await empresaRp.findOne({ where: { codigo: enterpriseCode } });

    const servicio = await servicioRp.findOne({
      where: { id: servicioId, empresaId: empresa.id, isActivo: true },
    });

    const recurso = await recursoRp.findOne({
      where: { id: recursoId, empresaId: empresa.id, isActivo: true },
      relations: ['horarios'],
    });

    if (!servicio) throw new Error('Este servicio no existe');
    if (!recurso) throw new Error('Este recurso no existe');

    const dateRange = DATE_UTILITIES.rangeOneDay(fecha, undefined, 'add');
    const rangosHabilitados: DataDisponibilidadI[] = [];
    const rangosExcluidos: DateRangeI[] = [];

    const day = dateRange.start;
    const dayForHumans = DATE_UTILITIES.dayForHumans(dateRange.start);

    orderBy(recurso.horarios, 'posicion', 'asc').forEach(h => {
      const workAt = {
        workToday: h[`workOn${dayForHumans}`],
        start: DATE_UTILITIES.parseMinutesToDate(day, h[`horaInicio${dayForHumans}`]),
        end: DATE_UTILITIES.parseMinutesToDate(day, h[`horaFinal${dayForHumans}`]),
      };
      if (workAt.workToday) {
        const rango = { start: workAt.start, end: workAt.end };
        rangosHabilitados.push({ horario: h, rango, rangos: [] });
      }
    });

    const reservas = await reservaRp.find({
      where: {
        recursoId,
        fechaInicio: Between(dateRange.start, dateRange.end),
        estadoCode: In(ESTADOS_RESERVA_VALIDOS_CODES),
      },
      order: { fechaInicio: 'ASC' },
    });

    reservas.forEach(r => {
      rangosExcluidos.push({
        start: DATE_UTILITIES.manageTimeZone(r.fechaInicio, 'remove'),
        end: DATE_UTILITIES.manageTimeZone(r.fechaFin, 'remove'),
      });
    });

    rangosHabilitados.forEach(e => {
      let nuevaFecha = e.rango.start;
      const rangoPermitido = rangosHabilitados.filter(rp => rp.horario.id === e.horario.id)[0];
      rangosExcluidos.forEach(re => {
        if (re.start >= e.rango.start && re.start <= e.rango.end) {
          rangoPermitido.rangos.push({ start: nuevaFecha, end: re.start });
          nuevaFecha = re.end;
        }
      });
      rangoPermitido.rangos.push({ start: nuevaFecha, end: e.rango.end });
    });

    return rangosHabilitados.map(rango => dataToDisponibilidadRecursoRes(rango, servicio));
  } catch (error: any) {
    throw new BadRequestException(error.message);
  }
};
