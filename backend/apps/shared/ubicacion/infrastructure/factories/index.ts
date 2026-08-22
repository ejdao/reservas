import { CorregimientoOrm, DepartamentoOrm, MunicipioOrm, PaisOrm } from '@orm/shared/ubicacion';
import { zonaTypeFactory } from '@ctypes/shared/ubicacion';
import {
  CorregimientoRes,
  DepartamentoRes,
  MunicipioRes,
  PaisRes,
} from '@shared/ubicacion/application/responses';

const municipioOrmToRes = (data: MunicipioOrm, codigo: string) => {
  const e = new MunicipioRes();
  e.id = data.id;
  e.codigo = `${codigo}${data.codigo}`;
  e.nombre = data.nombre;
  e.zona = zonaTypeFactory(data.zonaCode) as any;
  if (data.corregimientos) {
    e.corregimientos = data.corregimientos.map(c => corregimientoOrmToRes(c, e.codigo));
  }
  return e;
};

const corregimientoOrmToRes = (data: CorregimientoOrm, codigo: string) => {
  const e = new CorregimientoRes();
  e.id = data.id;
  e.codigo = `${codigo}${data.codigo}`;
  e.nombre = data.nombre;
  return e;
};

const departamentoOrmToRes = (data: DepartamentoOrm, codigo: string) => {
  const e = new DepartamentoRes();
  e.id = data.id;
  e.codigo = `${codigo}${data.codigo}`;
  e.nombre = data.nombre;
  if (data.municipios) {
    e.municipios = data.municipios.map(m => municipioOrmToRes(m, e.codigo));
  }
  return e;
};

const paisOrmToRes = (data: PaisOrm) => {
  const e = new PaisRes();
  e.id = data.id;
  e.codigo = data.codigo;
  e.nombre = data.nombre;
  e.idioma = data.idioma;
  e.codigoNumerico = data.codigoNumerico;
  e.codigoIdioma = data.codigoIdioma;
  e.codigoAlfa = data.codigoAlfa;
  if (data.departamentos) {
    e.departamentos = data.departamentos.map(d => departamentoOrmToRes(d, ''));
  }
  return e;
};

export const UBICACION_FACTORIES = {
  municipioOrmToRes,
  corregimientoOrmToRes,
  departamentoOrmToRes,
  paisOrmToRes,
};
