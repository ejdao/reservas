import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { MunicipioCrudSource } from '@shared/ubicacion/infrastructure/repositories';
import { MunicipioRes } from '@shared/ubicacion/application/responses';

@ApiTags('V1 | Ubicación')
@Controller('v1/shared/ubicacion/municipios')
export class MunicipiosCrudController {
  constructor(private _crud: MunicipioCrudSource) {}

  @ApiOkResponse({ type: MunicipioRes, isArray: true })
  @ApiQuery({ name: 'departamentoId', required: true, type: Number })
  @ApiQuery({ name: 'pattern', required: false, type: String })
  @ApiQuery({ name: 'addCorregimientos', required: false, type: Boolean })
  @Get()
  public async fetch(
    @Query('departamentoId') departamentoId: number,
    @Query('pattern') pattern: string,
    @Query('addCorregimientos') addCorregimientos: boolean
  ): Promise<MunicipioRes[]> {
    try {
      if (!departamentoId) throw new Error('Primero debe seleccionar un departamento');
      const result = await this._crud.fetch(+departamentoId, pattern, { addCorregimientos });
      return result;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
