import { CtmType } from '@common/domain/types';

export type RolUsuarioCode ='001' | '002';

export class RolUsuarioType extends CtmType<RolUsuarioCode> {}

const SIN_PERMISOS = new RolUsuarioType('001', 'SIN PERMISOS');
const ADMINISTRADOR = new RolUsuarioType('002', 'ADMINISTRADOR');

export function rolUsuarioTypeFactory(code: RolUsuarioCode): RolUsuarioType {
  switch (code) {
    case '001': return SIN_PERMISOS;
    case '002': return ADMINISTRADOR;
    default: throw new Error('No existe rol de usuario valido con este codigo');
  }
}

export const ROLES_USUARIO = { SIN_PERMISOS, ADMINISTRADOR };

export const ROLES_USUARIO_VALUES = [ SIN_PERMISOS, ADMINISTRADOR ];
