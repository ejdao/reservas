import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ReservarRecursoImpl,
  CancelarReservaImpl,
  PagarReservaImpl,
} from '@rsv/infrastructure/services';
import { ReservaCrudSource } from '@rsv/infrastructure/repositories';
import { FetchReservaRes } from '@rsv/infrastructure/responses';
import { CommonGuards } from '@common/presentation/decorators';
import { PagarReservaDto, ReservarRecursoDto, VerificarPagoDto } from '../dtos';

@CommonGuards()
@ApiTags('V1 | Reservas')
@Controller('v1/reservas')
export class ReservasController {
  constructor(
    private _crud: ReservaCrudSource,
    private _reservarRecurso: ReservarRecursoImpl,
    private _cancelarReserva: CancelarReservaImpl,
    private _pagos: PagarReservaImpl
  ) {}

  @Get()
  @ApiOkResponse({ type: FetchReservaRes, isArray: true })
  public fetch(@Query('start') start: Date, @Query('end') end: Date) {
    try {
      return this._crud.fetch(start, end);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('reservar-recurso')
  @ApiOkResponse({ type: Boolean })
  public async reservarRecurso(@Body() body: ReservarRecursoDto) {
    try {
      return this._reservarRecurso.execute(body);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('realizar-pago')
  @ApiOkResponse({ type: Boolean })
  public realizarPago(@Body() body: PagarReservaDto) {
    try {
      return this._pagos.realizar(body);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('verificar-pago')
  @ApiOkResponse({ type: Boolean })
  public verificarPago(@Body() body: VerificarPagoDto) {
    try {
      return this._pagos.verificar(body);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('cancelar/:reservaId')
  @ApiOkResponse({ type: Boolean })
  public async cancelarReserva(@Param('reservaId') reservaId: number) {
    try {
      return this._cancelarReserva.execute(reservaId);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
