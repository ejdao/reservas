import { CtmType } from '@common/domain/types';

export type ZonaCode = 1 | 2 | 3;

export class ZonaType extends CtmType<ZonaCode> {}

const NINGUNA = new ZonaType(1, 'NINGUNA');
const URBANA = new ZonaType(2, 'URBANA');
const RURAL = new ZonaType(3, 'RURAL');

export function zonaTypeFactory(code: ZonaCode): ZonaType {
  switch (code) {
    case 1: return NINGUNA;
    case 2: return URBANA;
    case 3: return RURAL;
    default: throw new Error('No existe zona valida con este codigo');
  }
}

export const ZONAS_VALUES = [NINGUNA, URBANA, RURAL];
export const ZONAS = { NINGUNA, URBANA, RURAL };
