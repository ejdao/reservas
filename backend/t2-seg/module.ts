import { Module } from '@nestjs/common';
import {
  AuthServicesImpl,
  LoginClienteImpl,
  LoginUsuarioImpl,
  PermisosServicesImpl,
} from './infrastructure/services';
import {
  PermisosController,
  ModulosController,
  SubModulosController,
  UsuariosController,
  RolesController,
  AuthTkUrqController,
  AuthTkRqController,
} from './presentation/controllers';
import {
  PermisosCrudSource,
  ModulosCrudSource,
  SubModulosCrudSource,
  UsuarioCrudSource,
  RolCrudSource,
} from './infrastructure/repositories';

@Module({
  controllers: [
    AuthTkUrqController,
    AuthTkRqController,
    SubModulosController,
    UsuariosController,
    PermisosController,
    ModulosController,
    RolesController,
  ],
  providers: [
    LoginUsuarioImpl,
    LoginClienteImpl,
    AuthServicesImpl,
    PermisosServicesImpl,
    SubModulosCrudSource,
    PermisosCrudSource,
    ModulosCrudSource,
    UsuarioCrudSource,
    RolCrudSource,
  ],
})
export class SeguridadModule {}
