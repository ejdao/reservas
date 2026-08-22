import { CtmType } from '@common/domain/types';

export type TipoPagoCode = 1 | 2 | 3 | 4 | 5 | 6;

export class TipoPagoType extends CtmType<TipoPagoCode> {}

const ANTICIPO = new TipoPagoType(1, 'ANTICIPO');
const PAGO_TOTAL = new TipoPagoType(2, 'PAGO TOTAL');
const PAGO_PARCIAL = new TipoPagoType(3, 'PAGO PARCIAL');
const ULTIMO_PAGO = new TipoPagoType(4, 'ULTIMO PAGO');

export function tipoPagoTypeFactory(code: TipoPagoCode): TipoPagoType {
  switch (code) {
    case 1 : return  ANTICIPO; 
    case 2 : return  PAGO_TOTAL; 
    case 3 : return  PAGO_PARCIAL; 
    case 4 : return  ULTIMO_PAGO; 
    default: throw new Error('No existe tipo de pago valido con este codigo');
  }
}

export const TIPO_PAGOS = { ANTICIPO, PAGO_TOTAL, PAGO_PARCIAL, ULTIMO_PAGO };
export const TIPO_PAGOS_VALUES = [ ANTICIPO, PAGO_TOTAL, PAGO_PARCIAL, ULTIMO_PAGO ];