import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class ReservarRecursoDto {
  @ApiProperty()
  @IsNumber()
  recursoId: number;
  @ApiProperty()
  @IsNumber()
  servicioId: number;
  @ApiProperty()
  @IsDateString()
  start: Date;
  @ApiProperty()
  @IsDateString()
  end: Date;
}
