import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export * from './modulo.res';
export * from './permiso.res';
export * from './rol.res';
export * from './usuario.res';
export * from './auth.res';

export class OnlyIdFromEntityRes {
  @ApiProperty()
  @IsString()
  id: string;
}
