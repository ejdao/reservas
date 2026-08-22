import { Module } from '@nestjs/common';
import { ReservaCrudSource } from './infrastructure/repositories';
import { ReservarRecursoNonAuthController, ReservasController } from './presentation/controllers';
import {
  ReservarRecursoNonAuthImpl,
  ReservarRecursoImpl,
  PagarReservaImpl,
  CancelarReservaImpl,
} from './infrastructure/services';

@Module({
  controllers: [ReservarRecursoNonAuthController, ReservasController],
  providers: [
    ReservarRecursoNonAuthImpl,
    CancelarReservaImpl,
    ReservarRecursoImpl,
    ReservaCrudSource,
    PagarReservaImpl,
  ],
})
export class ReservasModule {}
