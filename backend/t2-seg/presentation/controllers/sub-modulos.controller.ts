import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { SubModulosCrudSource } from '@seg/infrastructure/repositories';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { CreateSubModuloDto } from '@seg/application/dtos';
import { GEN_AUTHORITIES } from '@authorities/general';

@ApiTags('V1 | Submodulos')
@CommonGuards()
@Controller('v1/seguridad/sub-modulos')
export class SubModulosController {
  constructor(private _crud: SubModulosCrudSource) {}

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.CREAR_PERMISOS])
  @Post()
  async create(@Body() body: CreateSubModuloDto): Promise<boolean> {
    try {
      return await this._crud.create(body);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
