import { ApiProperty } from '@nestjs/swagger';

export class ModuloBasicoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;
}

export class FetchModuloRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty({ type: ModuloBasicoRes, isArray: true })
  subModulos: ModuloBasicoRes[];
}
