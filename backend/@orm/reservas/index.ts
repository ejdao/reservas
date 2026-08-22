import { CostoServicioOrm } from './servicio.costo.orm';
import { RecursoFileOrm } from './recurso.file.orm';
import { ServicioOrm } from './servicio.orm';
import { HorarioOrm } from './horario.orm';
import { RecursoOrm } from './recurso.orm';
import { ReservaOrm } from './reserva.orm';
import { PagoOrm } from './pago.orm';

export * from './servicio.costo.orm';
export * from './recurso.file.orm';
export * from './servicio.orm';
export * from './recurso.orm';
export * from './reserva.orm';
export * from './horario.orm';
export * from './pago.orm';

export const ORM_RSV_ENTITIES = [
  CostoServicioOrm,
  RecursoFileOrm,
  ServicioOrm,
  RecursoOrm,
  ReservaOrm,
  HorarioOrm,
  PagoOrm,
];
