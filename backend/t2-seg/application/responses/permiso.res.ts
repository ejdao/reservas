import { ApiProperty } from '@nestjs/swagger';
import { PermisoOrm } from '@orm/seguridad';
import { ModuloBasicoRes } from './modulo.res';

export class PermisoRes {
  @ApiProperty()
  isFromRol: boolean;

  @ApiProperty()
  isFromUsuario: boolean;

  @ApiProperty()
  id: string;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty({ type: () => ModuloBasicoRes })
  modulo: ModuloBasicoRes;

  @ApiProperty({ type: () => ModuloBasicoRes })
  subModulo: ModuloBasicoRes;
}

export class FetchPermisoRes {
  @ApiProperty({ type: PermisoRes, isArray: true })
  permisos: PermisoOrm[];

  @ApiProperty({ type: String, isArray: true })
  onlyCodigos: string[];
}
