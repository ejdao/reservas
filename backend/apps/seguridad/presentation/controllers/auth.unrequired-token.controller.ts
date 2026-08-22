import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { CTM_CONTEXTS_AUTHS_VALUES, CtmContextType } from '@common/domain/types';
import { LoginClienteImpl, LoginUsuarioImpl } from '@seg/infrastructure/services';
import { CtmTypeRes } from '@common/application/responses';
import { FetchEnterprisesRes, LoginRes } from '@seg/application/responses';
import { FetchEnterprisesDto, LoginClienteDto, LoginUsuarioDto } from '@seg/application/dtos';

@ApiTags('V1 | Autenticación')
@Controller('v1/auth')
export class AuthTkUrqController {
  constructor(
    private _loginUsuario: LoginUsuarioImpl,
    private _loginCliente: LoginClienteImpl
  ) {}

  @ApiResponse({ type: CtmTypeRes })
  @Get('contextos')
  public async fetchContexts(): Promise<CtmContextType[]> {
    return CTM_CONTEXTS_AUTHS_VALUES;
  }

  @Post('usuarios/fetch-enterprises')
  @ApiOkResponse({ type: FetchEnterprisesRes, isArray: true })
  public async fetchEnterprises(
    @Body() payload: FetchEnterprisesDto
  ): Promise<FetchEnterprisesRes[]> {
    try {
      return this._loginUsuario.fetchEnterprises(payload);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('usuarios/login')
  @ApiOkResponse({ type: LoginRes })
  public async loginUsuarios(@Body() payload: LoginUsuarioDto): Promise<LoginRes> {
    try {
      return this._loginUsuario.execute(payload);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('clientes/login')
  @ApiOkResponse({ type: LoginRes })
  public async loginClientes(@Body() payload: LoginClienteDto): Promise<LoginRes> {
    try {
      return this._loginCliente.execute(payload);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
