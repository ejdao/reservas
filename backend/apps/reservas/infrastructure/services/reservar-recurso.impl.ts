import { BadRequestException, Injectable } from '@nestjs/common';
import { ESTADO_PAGOS, ESTADOS_RESERVA, TIPO_PAGOS } from '@ctypes/reservas';
import { DATE_UTILITIES, DateRangeI } from '@common/application/services';
import { ReservaOrm, ServicioOrm, PagoOrm } from '@orm/reservas';
import { ReservarRecursoDto } from '@rsv/presentation/dtos';
import { fetchDisponibilidadRecurso } from './_common';
import { ReservaSource } from '../base';

@Injectable()
export class ReservarRecursoImpl extends ReservaSource {
  async execute(body: ReservarRecursoDto) {
    let transactionWasStarted = false;
    if (!this.auth.isCliente) throw new BadRequestException('Debes ser un cliente');
    try {
      const rangoSeleccionado = { start: new Date(body.start), end: new Date(body.end) };

      const disponibilidad = await fetchDisponibilidadRecurso(
        this.auth.context.getCode(),
        this.auth.enterpriseCode,
        body.recursoId,
        body.servicioId,
        (body.start as any as string).split('T')[0] as any as Date
      );

      const rangosValidos: DateRangeI[] = [];

      disponibilidad.forEach(r => rangosValidos.push(...r.rangos));

      const rangoValido = rangosValidos.filter(
        r =>
          r.start.getTime() === rangoSeleccionado.start.getTime() &&
          r.end.getTime() === rangoSeleccionado.end.getTime()
      );

      if (!rangoValido.length) throw new Error('Esta reserva fue seleccionada mientras pensabas');

      body.start = rangoSeleccionado.start;
      body.end = rangoSeleccionado.end;

      const empresa = await this.getEnterprise();

      await this.qr.connect();
      await this.qr.startTransaction();
      transactionWasStarted = true;

      const reservaRp = this.qr.manager.getRepository(ReservaOrm);
      const servicioRp = this.qr.manager.getRepository(ServicioOrm);
      const pagoRp = this.qr.manager.getRepository(PagoOrm);

      const servicio = await servicioRp.findOne({
        where: { id: body.servicioId },
        relations: ['costo'],
      });

      const newReserva = new ReservaOrm();
      newReserva.clienteId = this.auth.id;
      newReserva.empresaId = empresa.id;
      newReserva.recursoId = body.recursoId;
      newReserva.servicioId = body.servicioId;
      newReserva.estadoCode = ESTADOS_RESERVA.PROGRAMADA.getCode();
      newReserva.fechaInicio = DATE_UTILITIES.manageTimeZone(body.start, 'add');
      newReserva.fechaFin = DATE_UTILITIES.manageTimeZone(body.end, 'add');

      const reserva = await reservaRp.save(newReserva);

      const newPago = new PagoOrm();
      newPago.reservaId = reserva.id;
      newPago.estadoPagoCode = ESTADO_PAGOS.PENDIENTE.getCode();
      newPago.fechaCreacion = new Date();

      if (servicio.costo.anticipo > 0) {
        newPago.valor = servicio.costo.anticipo;
        newPago.tipoPagoCode = TIPO_PAGOS.ANTICIPO.getCode();
        await pagoRp.save(newPago);
        delete newPago.id;
      }

      newPago.valor = servicio.costo.valor - servicio.costo.anticipo;
      newPago.tipoPagoCode = TIPO_PAGOS.ULTIMO_PAGO.getCode();
      await pagoRp.save(newPago);

      if (transactionWasStarted) await this.qr.commitTransaction();

      return true;
    } catch (error: any) {
      if (transactionWasStarted) await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      if (transactionWasStarted) await this.qr.release();
    }
  }
}
