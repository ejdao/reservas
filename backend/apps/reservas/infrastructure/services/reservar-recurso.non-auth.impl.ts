import { BadRequestException, Injectable } from '@nestjs/common';
import { dataToRecursoRes, dataToServicioRes } from '../factories';
import { CtmContextCode, ctmContextTypeFactory } from '@common/domain/types';
import { RsvRecursoRes, ServicioRes } from '../responses';
import { fetchDisponibilidadRecurso } from './_common';
import { switchConn } from 'src/app.connections';
import { ReservaNonAuthSource } from '../base';
import { HorarioOrm } from '@orm/reservas';

export interface DataDisponibilidadI {
  horario: HorarioOrm;
  rango: { start: Date; end: Date };
  rangos: { start: Date; end: Date }[];
}

@Injectable()
export class ReservarRecursoNonAuthImpl extends ReservaNonAuthSource {
  async fetchRecursos(
    contextCode: CtmContextCode,
    enterpriseCode: string
  ): Promise<RsvRecursoRes[]> {
    const context = ctmContextTypeFactory(contextCode);
    const conn = switchConn(context);
    const empresa = await this.getEnterprise(conn, enterpriseCode, ['recursos', 'recursos.files']);
    const recursos = empresa.recursos.filter(e => e.isActivo);
    return recursos.map(e => dataToRecursoRes(e));
  }

  async fetchServicios(
    contextCode: CtmContextCode,
    enterpriseCode: string
  ): Promise<ServicioRes[]> {
    const context = ctmContextTypeFactory(contextCode);
    const conn = switchConn(context);
    const empresa = await this.getEnterprise(conn, enterpriseCode, [
      'servicios',
      'servicios.costo',
    ]);
    const servicios = empresa.servicios.filter(e => e.isActivo);
    return servicios.map(s => dataToServicioRes(s));
  }

  async fetchDisponibilidadRecursoLocal(
    contextCode: CtmContextCode,
    enterpriseCode: string,
    recursoId: number,
    servicioId: number,
    fecha: Date
  ) {
    try {
      return fetchDisponibilidadRecurso(contextCode, enterpriseCode, recursoId, servicioId, fecha);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
