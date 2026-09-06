import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ESTADO_USUARIO_VALUES, EstadoUsuarioType } from '@ctypes/general/usuario';
import { CreateUsuarioRes, FetchUsuarioRes } from '@seg/application/responses';
import { CreateUsuarioDto, UpdateUsuarioDto } from '@seg/application/dtos';
import { UsuarioCrudSource } from '@seg/infrastructure/repositories';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { CtmTypeRes } from '@common/application/responses';
import { GEN_AUTHORITIES } from '@authorities/general';

@ApiTags('V1 | Usuarios')
@CommonGuards()
@Controller('v1/seguridad/usuarios')
export class UsuariosController {
  constructor(private _crud: UsuarioCrudSource) {}

  @ApiOkResponse({ type: FetchUsuarioRes })
  @ApiQuery({ name: 'pattern', required: false, type: String })
  @ApiQuery({ name: 'isUpdatingUsers', required: false, type: String })
  @Authorities([
    GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_USUARIOS,
    GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS,
  ])
  @Get()
  public async fetch(
    @Query('pattern') pattern: string,
    @Query('isUpdatingUsers') isUpdatingUsers: boolean
  ): Promise<FetchUsuarioRes[]> {
    try {
      return await this._crud.fetch(pattern, isUpdatingUsers);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: CreateUsuarioRes })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_USUARIOS])
  @Post()
  public async create(@Body() body: CreateUsuarioDto): Promise<CreateUsuarioRes> {
    try {
      return await this._crud.create(body);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_USUARIOS])
  @Put(':id')
  public async update(@Param('id') id: string, @Body() body: UpdateUsuarioDto): Promise<boolean> {
    try {
      return await this._crud.update(id, body);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: CtmTypeRes, isArray: true })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_USUARIOS])
  @Get('estados/suggestions')
  public async fetchEstados(): Promise<EstadoUsuarioType[]> {
    try {
      return ESTADO_USUARIO_VALUES;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_USUARIOS])
  @Get('reset-password/:usuarioId')
  public async resetPassword(@Param('usuarioId') usuarioId: string): Promise<boolean> {
    try {
      return await this._crud.resetPassword(usuarioId);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
