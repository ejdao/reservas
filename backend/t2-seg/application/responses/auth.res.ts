import { ApiProperty } from '@nestjs/swagger';

export class LoginRes {
  @ApiProperty()
  token: string;
}

export class FetchEnterprisesRes {
  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;
}

export class MyAuthDataRes {
  @ApiProperty()
  documento: string;

  @ApiProperty()
  nombreCompleto: string;

  @ApiProperty()
  permisos: string[];
}
