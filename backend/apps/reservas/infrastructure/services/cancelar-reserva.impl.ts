import { BadRequestException, Injectable } from '@nestjs/common';
import { DATE_UTILITIES } from '@common/application/services';
import { BaseSource } from '@common/infrastructure/services';
import { ESTADOS_RESERVA } from '@ctypes/reservas';
import { ReservaOrm } from '@orm/reservas';

@Injectable()
export class CancelarReservaImpl extends BaseSource {
  async execute(reservaId: number) {
    try {
      await this.qr.connect();
      await this.qr.startTransaction();

      const reservaRp = this.qr.manager.getRepository(ReservaOrm);
      const reserva = await reservaRp.findOne({
        where: { id: reservaId },
        relations: ['recurso', 'recurso.usuarios'],
      });

      if (!reserva) {
        throw new BadRequestException('La reserva no existe');
      }

      if (reserva.estadoCode === ESTADOS_RESERVA.CANCELADA.getCode()) {
        throw new BadRequestException('La reserva ya se encuentra cancelada');
      }

      const isClienteReservador = this.auth.isCliente && reserva.clienteId === this.auth.id;
      const isEncargadoRecurso =
        this.auth.isUsuario && reserva.recurso.usuarios.some(u => u.id === this.auth.id);

      if (!isClienteReservador && !isEncargadoRecurso) {
        throw new BadRequestException('No tienes permisos para cancelar esta reserva');
      }

      const now = DATE_UTILITIES.manageTimeZone(new Date(), 'remove');
      const diffInMs = reserva.fechaInicio.getTime() - now.getTime();
      const diffInMinutes = diffInMs / (1000 * 60);

      if (diffInMinutes < reserva.recurso.maxTimePreviousCancelInMinutes) {
        throw new BadRequestException(
          `Ya pasó el tiempo máximo permitido para cancelar esta reserva (${reserva.recurso.maxTimePreviousCancelInMinutes} minutos antes)`
        );
      }

      reserva.estadoCode = ESTADOS_RESERVA.CANCELADA.getCode();
      await reservaRp.save(reserva);

      await this.qr.commitTransaction();
      return true;
    } catch (error: any) {
      await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await this.qr.release();
    }
  }
}
