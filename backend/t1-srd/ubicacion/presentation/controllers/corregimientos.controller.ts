import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { CorregimientoCrudSource } from '@shared/ubicacion/infrastructure/repositories';
import { CorregimientoRes, MunicipioRes } from '@shared/ubicacion/application/responses';

@ApiTags('V1 | Ubicación')
@Controller('v1/shared/ubicacion/corregimientos')
export class CorregimientosCrudController {
  constructor(private _crud: CorregimientoCrudSource) {}

  @ApiOkResponse({ type: MunicipioRes, isArray: true })
  @ApiQuery({ name: 'municipioId', required: false, type: Number })
  @ApiQuery({ name: 'pattern', required: false, type: String })
  @Get()
  public async fetchByMunicipio(
    @Query('municipioId') municipioId: number,
    @Query('pattern') pattern: string
  ): Promise<CorregimientoRes[]> {
    try {
      if (!municipioId) throw new Error('Primero debe seleccionar un municipio');
      const result = await this._crud.fetch(+municipioId, pattern);
      return result;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
