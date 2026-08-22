import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubModuloDto {
  @ApiProperty()
  @IsString()
  nombre: string;
  @ApiProperty()
  @IsString()
  moduloCode: string;
}
