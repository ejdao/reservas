import { CorregimientoOrm } from './corregimiento.orm';
import { DepartamentoOrm } from './departamento.orm';
import { MunicipioOrm } from './municipio.orm';
import { PaisOrm } from './pais.orm';

export * from './corregimiento.orm';
export * from './departamento.orm';
export * from './municipio.orm';
export * from './pais.orm';

export const ORM_UBI_ENTITIES = [CorregimientoOrm, DepartamentoOrm, MunicipioOrm, PaisOrm];
