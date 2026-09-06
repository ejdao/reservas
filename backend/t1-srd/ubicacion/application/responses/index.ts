import { ApiProperty } from '@nestjs/swagger';
import { CtmTypeRes } from '@common/application/responses';

export class CorregimientoRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;
}

export class MunicipioRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty({ type: CtmTypeRes })
  zona: CtmTypeRes;

  @ApiProperty({ type: CorregimientoRes, isArray: true })
  corregimientos: CorregimientoRes[];
}

export class DepartamentoRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty({ type: MunicipioRes, isArray: true })
  municipios: MunicipioRes[];
}

export class PaisRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  idioma: string;

  @ApiProperty()
  codigoNumerico: string;

  @ApiProperty()
  codigoIdioma: string;

  @ApiProperty()
  codigoAlfa: string;

  @ApiProperty({ type: DepartamentoRes, isArray: true })
  departamentos: DepartamentoRes[];
}
