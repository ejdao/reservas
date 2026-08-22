import { ApiProperty } from '@nestjs/swagger';

export class CtmTypeRes {
  @ApiProperty()
  code: number;
  @ApiProperty()
  forHumans: string;
  @ApiProperty({ example: 'string (opcional)' })
  abbreviation: string;
}
