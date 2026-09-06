import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { AuthServicesImpl } from '@seg/infrastructure/services';
import { MyAuthDataRes } from '@seg/application/responses';
import { CommonGuards } from '@common/presentation/decorators';

@ApiTags('V1 | Autenticación')
@CommonGuards()
@Controller('v1/auth')
export class AuthTkRqController {
  constructor(private _services: AuthServicesImpl) {}

  @Get('logout')
  @ApiOkResponse({ type: Boolean })
  public logout(): Promise<boolean> {
    try {
      return this._services.logout();
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('update-password/:newPassword')
  @ApiOkResponse({ type: Boolean })
  @ApiQuery({ name: 'wasReset', required: false, type: Boolean })
  public updatePassword(
    @Param('newPassword') newPassword: string,
    @Query('wasReset') wasReset: boolean
  ): Promise<{ token: string }> {
    try {
      return this._services.updatePassword(newPassword, wasReset);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: MyAuthDataRes })
  @Get('data')
  public async data(): Promise<MyAuthDataRes> {
    try {
      return await this._services.data();
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
