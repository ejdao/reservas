import { CtmType } from '@common/domain/types';

export type EstadoUsuarioCode = 1 | 2 | 3 | 4 | 5;

export class EstadoUsuarioType extends CtmType<EstadoUsuarioCode> {}

const ACTIVO = new EstadoUsuarioType(1, 'ACTIVO');
const INACTIVO = new EstadoUsuarioType(2, 'INACTIVO');
const SUSPENDIDO = new EstadoUsuarioType(3, 'SUSPENDIDO');
const RETIRADO = new EstadoUsuarioType(4, 'RETIRADO');
const ACCESO_BLOQUEADO = new EstadoUsuarioType(5, 'ACCESO BLOQUEADO');

export function estadoUsuarioTypeFactory(code: EstadoUsuarioCode): EstadoUsuarioType {
  switch (code) {
    case 1: return ACTIVO;
    case 2: return INACTIVO;
    case 3: return SUSPENDIDO;
    case 4: return RETIRADO;
    case 5: return ACCESO_BLOQUEADO;
    default: throw new Error('No existe estado de usuario valido con este codigo');
  }
}

export const ESTADO_USUARIO = { ACTIVO, INACTIVO, SUSPENDIDO, RETIRADO, ACCESO_BLOQUEADO };

export const ESTADO_USUARIO_VALUES = [ ACTIVO, INACTIVO, SUSPENDIDO, RETIRADO, ACCESO_BLOQUEADO ];
