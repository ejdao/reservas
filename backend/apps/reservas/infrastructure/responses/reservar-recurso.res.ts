import { ApiProperty } from '@nestjs/swagger';

export class RsvRecursoRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  fileName: string;
  @ApiProperty({ type: String, isArray: true })
  fileNames: string[];
}

export class ServicioRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  descripcion: string;
  @ApiProperty()
  duracionInMinutes: number;
  @ApiProperty()
  costo: number;
}

export class DispoHorarioRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  descripcion: string;
  @ApiProperty()
  start: Date;
  @ApiProperty()
  end: Date;
}

export class DispoRangoRes {
  @ApiProperty()
  start: Date;
  @ApiProperty()
  end: Date;
}

export class DisponibilidadRecursoRes {
  @ApiProperty({ type: DispoHorarioRes })
  horario: DispoHorarioRes;
  @ApiProperty({ type: DispoRangoRes, isArray: true })
  rangos: DispoRangoRes[];
}
