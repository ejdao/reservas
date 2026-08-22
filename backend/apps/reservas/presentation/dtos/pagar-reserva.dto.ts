import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class PagarReservaDto {
  @ApiProperty()
  @IsNumber()
  reservaId: number;
  @ApiProperty()
  @IsNumber()
  pagoId: number;
  @ApiProperty()
  @IsString()
  comprobanteFileName: string;
}

export class VerificarPagoDto {
  @ApiProperty()
  @IsNumber()
  reservaId: number;
  @ApiProperty()
  @IsNumber()
  pagoId: number;
  @ApiProperty()
  @IsBoolean()
  isAprobado: boolean;
  @ApiProperty()
  @IsString()
  observaciones: string;
}
