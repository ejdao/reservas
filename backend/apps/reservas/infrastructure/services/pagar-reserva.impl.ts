import { BadRequestException, Injectable } from '@nestjs/common';
import { ESTADO_PAGOS, ESTADOS_RESERVA_VALIDOS_CODES as RsvValCds } from '@ctypes/reservas';
import { BaseSource } from '@common/infrastructure/services';
import { PagarReservaDto, VerificarPagoDto } from '@rsv/presentation/dtos';
import { PagoOrm, ReservaOrm } from '@orm/reservas';

@Injectable()
export class PagarReservaImpl extends BaseSource {
  async realizar(body: PagarReservaDto) {
    let transactionStarted = false;
    try {
      if (!this.auth.isCliente) throw new Error('Usted no es un cliente');

      transactionStarted = true;
      await this.qr.connect();
      await this.qr.startTransaction();
      const reservaRp = this.qr.manager.getRepository(ReservaOrm);
      const pagoRp = this.qr.manager.getRepository(PagoOrm);

      const reserva = await reservaRp.findOne({ where: { id: body.reservaId } });
      const pagos = await pagoRp.find({
        where: { reservaId: body.reservaId },
        order: { id: 'ASC' },
      });

      let pagoActual: PagoOrm;
      let pagoPrevio: PagoOrm;

      pagos.forEach((p, i) => {
        if (p.id === body.pagoId) {
          pagoActual = p;
          if (i > 0) pagoPrevio = pagos[i - 1];
        }
      });

      if (!reserva) throw new Error('No existe esta reserva');
      if (RsvValCds.indexOf(reserva.estadoCode) < 0) throw new Error('Reserva no apta para pagar');
      if (!pagoActual) throw new Error('No existe este pago');
      if (pagoActual.estadoPagoCode !== ESTADO_PAGOS.PENDIENTE.getCode()) {
        throw new Error('El pago ya no está pendiente');
      }
      if (pagoPrevio) {
        if (pagoPrevio.estadoPagoCode === ESTADO_PAGOS.PENDIENTE.getCode()) {
          throw new Error('El pago anterior a este sigue pendiente');
        }
        if (pagoPrevio.estadoPagoCode === ESTADO_PAGOS.RECHAZADO.getCode()) {
          throw new Error('El pago anterior a este fue rechazado');
        }
        if (pagoPrevio.estadoPagoCode !== ESTADO_PAGOS.ACEPTADO.getCode()) {
          throw new Error('El pago anterior a este no ha sido aceptado');
        }
      }

      pagoActual.estadoPagoCode = ESTADO_PAGOS.PAGADO.getCode();
      pagoActual.comprobanteFileName = body.comprobanteFileName;
      pagoActual.fechaPago = new Date();
      await pagoRp.save(pagoActual);

      await this.qr.commitTransaction();
      return true;
    } catch (error: any) {
      if (transactionStarted) await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      if (transactionStarted) await this.qr.release();
    }
  }

  async verificar(body: VerificarPagoDto) {
    let transactionStarted = false;
    try {
      if (!this.auth.isUsuario) throw new Error('Usted no es un usuario');

      transactionStarted = true;
      await this.qr.connect();
      await this.qr.startTransaction();
      const reservaRp = this.qr.manager.getRepository(ReservaOrm);
      const pagoRp = this.qr.manager.getRepository(PagoOrm);

      const reserva = await reservaRp.findOne({ where: { id: body.reservaId } });
      const pago = await pagoRp.findOne({
        where: { id: body.pagoId, reservaId: body.reservaId },
      });

      if (!reserva) throw new Error('No existe esta reserva');
      if (RsvValCds.indexOf(reserva.estadoCode) < 0) {
        throw new Error('Reserva no apta para verificar');
      }
      if (!pago) throw new Error('No existe este pago');
      if (pago.estadoPagoCode !== ESTADO_PAGOS.PAGADO.getCode()) {
        throw new Error('El pago no está en estado PAGADO');
      }

      pago.estadoPagoCode = body.isAprobado
        ? ESTADO_PAGOS.ACEPTADO.getCode()
        : ESTADO_PAGOS.RECHAZADO.getCode();
      pago.fechaVerificacion = new Date();
      pago.observaciones = body.observaciones;
      pago.verificadoPorId = this.auth.id;
      await pagoRp.save(pago);

      await this.qr.commitTransaction();
      return true;
    } catch (error: any) {
      if (transactionStarted) await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      if (transactionStarted) await this.qr.release();
    }
  }
}
