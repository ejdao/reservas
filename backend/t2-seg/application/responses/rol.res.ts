import { ApiProperty } from '@nestjs/swagger';
import { PermisoRes } from './permiso.res';

export class FetchRolRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty({ type: PermisoRes, isArray: true })
  permisos: PermisoRes[];
}
