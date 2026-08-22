import { CtmType } from '@common/domain/types';

export type EstadoReservaCode = 1 | 2 | 3 | 4 | 5 ;

export class EstadoReservaType extends CtmType<EstadoReservaCode> {}

const PROGRAMADA = new EstadoReservaType(1, 'PROGRAMADA');
const CONFIRMADA = new EstadoReservaType(2, 'CONFIRMADA');
const CANCELADA = new EstadoReservaType(3, 'CANCELADA');
const EXPIRADA = new EstadoReservaType(4, 'EXPIRADA');
const COMPLETADA = new EstadoReservaType(5, 'COMPLETADA');

export function estadoReservaTypeFactory(code: EstadoReservaCode): EstadoReservaType {
  switch (code) {
    case 1 : return  PROGRAMADA; 
    case 2 : return  CONFIRMADA; 
    case 3 : return  CANCELADA; 
    case 4 : return  EXPIRADA; 
    case 5 : return  COMPLETADA; 
    default: throw new Error('No existe estado valido con este codigo');
  }
}

export const ESTADOS_RESERVA = { PROGRAMADA, CONFIRMADA, CANCELADA, EXPIRADA, COMPLETADA };
export const ESTADOS_RESERVA_VALUES = [ PROGRAMADA, CONFIRMADA, CANCELADA, EXPIRADA, COMPLETADA ];
export const ESTADOS_RESERVA_VALIDOS_CODES = [PROGRAMADA.getCode(), CONFIRMADA.getCode(), COMPLETADA.getCode()];