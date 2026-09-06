import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { STRING_UTILITIES } from '@common/application/services';
import { CTM_CONTEXTS, CtmContextCode, CtmContexts } from '@common/domain/types';

export class FetchEnterprisesDto {
  @IsOptional()
  @ApiProperty({ example: CTM_CONTEXTS.DEFAULT.getCode() })
  @IsEnum(CtmContexts, { message: `${STRING_UTILITIES.enumToString(CtmContexts)}` })
  contextCode: CtmContextCode;

  @ApiProperty({ example: '1234' })
  @IsString()
  username: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  password: string;
}

export class LoginUsuarioDto {
  @ApiProperty({ example: CTM_CONTEXTS.DEFAULT.getCode() })
  @IsEnum(CtmContexts, { message: `${STRING_UTILITIES.enumToString(CtmContexts)}` })
  contextCode: CtmContextCode;

  @ApiProperty({ example: 'EMPBYDEFTO' })
  @IsString()
  enterpriseCode: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  username: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  password: string;
}

export class LoginClienteDto {
  @IsOptional()
  @ApiProperty({ example: CTM_CONTEXTS.DEFAULT.getCode() })
  @IsEnum(CtmContexts, { message: `${STRING_UTILITIES.enumToString(CtmContexts)}` })
  contextCode: CtmContextCode;

  @ApiProperty({ example: 'EMPBYDEFTO' })
  @IsString()
  enterpriseCode: string;

  @ApiProperty({ example: '3005007792' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'rafael@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'RAFAEL MENDOZA' })
  @IsString()
  fullName: string;
}
