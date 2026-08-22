import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ReservarRecursoNonAuthImpl } from '@rsv/infrastructure/services';
import { CtmContextCode, CtmContexts } from '@common/domain/types';
import {
  DisponibilidadRecursoRes,
  RsvRecursoRes,
  ServicioRes,
} from '@rsv/infrastructure/responses';

@ApiTags('V1 | Reservas')
@Controller('v1/reservas')
export class ReservarRecursoNonAuthController {
  constructor(private _servicesNonAuth: ReservarRecursoNonAuthImpl) {}

  @Get('fetch-servicios')
  @ApiOkResponse({ type: ServicioRes, isArray: true })
  @ApiQuery({ name: 'contextCode', enum: CtmContexts, required: false })
  @ApiQuery({ name: 'enterpriseCode', type: String, required: true })
  public fetchServicios(
    @Query('contextCode') contextCode: CtmContextCode,
    @Query('enterpriseCode') enterpriseCode: string
  ) {
    try {
      return this._servicesNonAuth.fetchServicios(contextCode, enterpriseCode);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('fetch-recursos')
  @ApiOkResponse({ type: RsvRecursoRes, isArray: true })
  @ApiQuery({ name: 'contextCode', enum: CtmContexts, required: false })
  @ApiQuery({ name: 'enterpriseCode', type: String, required: true })
  public fetchRecursos(
    @Query('contextCode') contextCode: CtmContextCode,
    @Query('enterpriseCode') enterpriseCode: string
  ) {
    try {
      return this._servicesNonAuth.fetchRecursos(contextCode, enterpriseCode);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('fetch-disponibilidad')
  @ApiQuery({ name: 'contextCode', enum: CtmContexts, required: false })
  @ApiQuery({ name: 'enterpriseCode', type: String, required: true })
  @ApiQuery({ name: 'recursoId', type: Number, required: true })
  @ApiQuery({ name: 'servicioId', type: Number, required: true })
  @ApiQuery({ name: 'fecha', type: Date, required: true })
  @ApiOkResponse({ type: DisponibilidadRecursoRes, isArray: true })
  public fetchDisponibilidadRecurso(
    @Query('contextCode') contextCode: CtmContextCode,
    @Query('enterpriseCode') enterpriseCode: string,
    @Query('recursoId') recursoId: number,
    @Query('servicioId') servicioId: number,
    @Query('fecha') fecha: Date
  ) {
    try {
      return this._servicesNonAuth.fetchDisponibilidadRecursoLocal(
        contextCode,
        enterpriseCode,
        +recursoId,
        +servicioId,
        fecha
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
