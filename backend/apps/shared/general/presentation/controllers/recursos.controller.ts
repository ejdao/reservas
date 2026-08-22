import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { RecursosImpl } from '@shared/general/infrastructure/services';
import { RecursoRes } from '@shared/common';

@ApiTags('V1 | General')
@Controller('v1/shared/general/recursos')
export class RecursosController {
  constructor(private _fetchEps: RecursosImpl) {}

  @ApiOkResponse({ type: RecursoRes, isArray: true })
  @ApiQuery({ name: 'pattern', required: true, type: String })
  @Get('eps')
  public async fetch(@Query('pattern') pattern: string): Promise<RecursoRes[]> {
    try {
      const result = await this._fetchEps.eps(pattern);
      return result;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
