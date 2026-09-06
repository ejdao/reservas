import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Get, Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ModulosCrudSource } from '@seg/infrastructure/repositories';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { FetchModuloRes } from '@seg/application/responses';
import { CreateModuloDto } from '@seg/application/dtos';
import { GEN_AUTHORITIES } from '@authorities/general';

@ApiTags('V1 | Modulos')
@CommonGuards()
@Controller('v1/seguridad/modulos')
export class ModulosController {
  constructor(private _crud: ModulosCrudSource) {}

  @ApiOkResponse({ type: FetchModuloRes })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.CREAR_PERMISOS])
  @Get()
  async fetch(): Promise<FetchModuloRes[]> {
    try {
      return await this._crud.fetch();
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.CREAR_PERMISOS])
  @Post()
  async create(@Body() body: CreateModuloDto): Promise<boolean> {
    try {
      return await this._crud.create(body);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
