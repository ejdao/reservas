import { CtmType } from '@common/domain/types';

export type EstadoPagoCode = 1 | 2 | 3 | 4;

export class EstadoPagoType extends CtmType<EstadoPagoCode> {}

const PENDIENTE = new EstadoPagoType(1, 'PENDIENTE');
const PAGADO = new EstadoPagoType(2, 'PAGADO');
const ACEPTADO = new EstadoPagoType(3, 'ACEPTADO');
const RECHAZADO = new EstadoPagoType(4, 'RECHAZADO');

export function estadoPagoTypeFactory(code: EstadoPagoCode): EstadoPagoType {
  switch (code) {
    case 1 : return  PENDIENTE; 
    case 2 : return  PAGADO; 
    case 3 : return  ACEPTADO;
    case 4 : return  RECHAZADO;
    default: throw new Error('No existe stado de pago valido con este codigo');
  }
}

export const ESTADO_PAGOS = { PENDIENTE, PAGADO, ACEPTADO, RECHAZADO };
export const ESTADO_PAGOS_VALUES = [ PENDIENTE, PAGADO, ACEPTADO, RECHAZADO ];