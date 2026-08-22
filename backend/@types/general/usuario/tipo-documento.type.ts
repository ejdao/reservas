import { CtmType } from '@common/domain/types';

export type TipoDocUsuarioCode = 1 | 2 | 3 | 4 | 5;

export class TipoDocUsuarioType extends CtmType<TipoDocUsuarioCode> {}

const REGISTRO_CIVIL = new TipoDocUsuarioType(1, 'REGISTRO CIVIL', 'RC');
const TARJETA_IDENTIDAD = new TipoDocUsuarioType(2, 'TARJETA DE IDENTIDAD', 'TI');
const CEDULA_CIUDADANIA = new TipoDocUsuarioType(3, 'CEDULA DE CIUDADANIA', 'CC');
const CEDULA_EXTRANJERA = new TipoDocUsuarioType(4, 'CEDULA EXTRANJERA', 'CE');
const SIN_DOCUMENTO = new TipoDocUsuarioType(5, 'SIN DOCUMENTO', 'SD');

export function tipoDocUsuarioTypeFactory(code: TipoDocUsuarioCode): TipoDocUsuarioType {
  switch (code) {
    case 1: return REGISTRO_CIVIL;
    case 2: return TARJETA_IDENTIDAD;
    case 3: return CEDULA_CIUDADANIA;
    case 4: return CEDULA_EXTRANJERA;
    case 3: return SIN_DOCUMENTO;
    default: throw new Error('No existe tipo de documento valido con este codigo');
  }
}

export const TIPOS_DOCUMENTO = {
  REGISTRO_CIVIL,
  TARJETA_IDENTIDAD,
  CEDULA_CIUDADANIA,
  CEDULA_EXTRANJERA,
  SIN_DOCUMENTO,
};

export const TIPOS_DOCUMENTO_VALUES = [
  REGISTRO_CIVIL,
  TARJETA_IDENTIDAD,
  CEDULA_CIUDADANIA,
  CEDULA_EXTRANJERA,
  SIN_DOCUMENTO,
];
