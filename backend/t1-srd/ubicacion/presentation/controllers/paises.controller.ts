import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PaisCrudSource } from '@shared/ubicacion/infrastructure/repositories';
import { PaisRes } from '@shared/ubicacion/application/responses';

@ApiTags('V1 | Ubicación')
@Controller('v1/shared/ubicacion/paises')
export class PaisesCrudController {
  constructor(private _crud: PaisCrudSource) {}

  @ApiOkResponse({ type: PaisRes, isArray: true })
  @ApiQuery({ name: 'pattern', required: false, type: String })
  @ApiQuery({ name: 'addDepartamentos', required: false, type: Boolean })
  @ApiQuery({ name: 'addMunicipios', required: false, type: Boolean })
  @ApiQuery({ name: 'addCorregimientos', required: false, type: Boolean })
  @Get()
  public async fetch(
    @Query('pattern') pattern: string,
    @Query('addDepartamentos') addDepartamentos: boolean,
    @Query('addMunicipios') addMunicipios: boolean,
    @Query('addCorregimientos') addCorregimientos: boolean
  ): Promise<PaisRes[]> {
    try {
      const result = await this._crud.fetch(pattern, {
        addDepartamentos,
        addMunicipios,
        addCorregimientos,
      });
      return result;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
