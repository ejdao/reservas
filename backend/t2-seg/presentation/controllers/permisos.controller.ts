import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Get, Controller, Param, Post, Body, BadRequestException, Query } from '@nestjs/common';
import { PermisosCrudSource } from '@seg/infrastructure/repositories';
import { PermisosServicesImpl } from '@seg/infrastructure/services';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { FetchPermisoRes } from '@seg/application/responses';
import { CreatePermisoDto } from '@seg/application/dtos';
import { GEN_AUTHORITIES } from '@authorities/general';

@ApiTags('V1 | Permisos')
@CommonGuards()
@Controller('v1/seguridad/permisos')
export class PermisosController {
  constructor(
    private _crud: PermisosCrudSource,
    private _services: PermisosServicesImpl
  ) {}

  @ApiOkResponse({ type: FetchPermisoRes })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS])
  @Get()
  async fetch(@Query('onlyCodigos') onlyCodigos: boolean): Promise<FetchPermisoRes> {
    try {
      return await this._crud.fetch(onlyCodigos);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.CREAR_PERMISOS])
  @Post()
  async create(@Body() body: CreatePermisoDto): Promise<boolean> {
    try {
      return await this._crud.create(body);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: FetchPermisoRes })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS])
  @Get('by-usuario/:id')
  public async fetchByUsuario(@Param('id') id: string): Promise<FetchPermisoRes> {
    try {
      return this._services.fetchByUsuario(id);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS])
  @Get('add-permiso-to-usuario/:permisoId/:usuarioId')
  async addPermisoToUsuario(
    @Param('permisoId') permisoId: string,
    @Param('usuarioId') usuarioId: string
  ): Promise<boolean> {
    try {
      return this._services.addPermisoToUsuario(permisoId, usuarioId);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS])
  @Get('remove-permiso-to-usuario/:permisoId/:usuarioId')
  async removePermisoToUsuario(
    @Param('permisoId') permisoId: string,
    @Param('usuarioId') usuarioId: string
  ): Promise<boolean> {
    try {
      return this._services.removePermisoToUsuario(permisoId, usuarioId);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS])
  @Get('add-permiso-to-rol/:permisoId/:rolId')
  async addPermisoToRol(
    @Param('permisoId') permisoId: string,
    @Param('rolId') rolId: string
  ): Promise<boolean> {
    try {
      return this._services.addPermisoToRol(permisoId, rolId);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS])
  @Get('remove-permiso-to-rol/:permisoId/:rolId')
  async removePermisoToRol(
    @Param('permisoId') permisoId: string,
    @Param('rolId') rolId: string
  ): Promise<boolean> {
    try {
      return this._services.removePermisoToRol(permisoId, rolId);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
