import { EmpresaOrm } from './empresa.orm';
import { UsuarioOrm } from './usuario.orm';
import { RolOrm } from './rol.orm';
import { PermisoOrm } from './permiso.orm';
import { ModuloOrm } from './modulo.orm';
import { SubModuloOrm } from './sub-modulo.orm';
import { TokenOrm } from './token.orm';
import { TipoTransaccionOrm } from './tipo-transaccion.orm';
import { TransaccionOrm } from './transaccion.orm';

export * from './empresa.orm';
export * from './usuario.orm';
export * from './rol.orm';
export * from './permiso.orm';
export * from './modulo.orm';
export * from './sub-modulo.orm';
export * from './token.orm';
export * from './tipo-transaccion.orm';
export * from './transaccion.orm';

export const ORM_SEG_ENTITIES = [
  EmpresaOrm,
  UsuarioOrm,
  RolOrm,
  PermisoOrm,
  ModuloOrm,
  SubModuloOrm,
  TokenOrm,
  TipoTransaccionOrm,
  TransaccionOrm,
];
