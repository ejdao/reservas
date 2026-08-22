import { RecursoOrm, ServicioOrm } from '@orm/reservas';
import { DisponibilidadRecursoRes, RsvRecursoRes, ServicioRes } from '../responses';
import { FILE_PATHS as locations } from '@common/application/constants';
import { DATE_UTILITIES } from '@common/application/services';
import { ENVIRONMENTS as env } from 'src/app.environments';
import { DataDisponibilidadI } from '../services';

export const dataToRecursoRes = (e: RecursoOrm): RsvRecursoRes => {
  const n: RsvRecursoRes = {
    id: e.id,
    nombre: e.nombreCompleto,
    fileName: `${env.public}/${locations.reservas.recursos}/${e.fileName}`,
    fileNames: e.files.map(f => `${env.public}/${locations.reservas.recursos}/${f.fileName}`),
  };
  return n;
};

export const dataToServicioRes = (e: ServicioOrm): ServicioRes => {
  const n: ServicioRes = {
    id: e.id,
    nombre: e.nombre,
    descripcion: e.descripcion,
    duracionInMinutes: e.duracion,
    costo: e.costo.valor,
  };
  return n;
};

export const dataToDisponibilidadRecursoRes = (
  disponibilidad: DataDisponibilidadI,
  servicio: ServicioOrm
): DisponibilidadRecursoRes => {
  const n: DisponibilidadRecursoRes = {
    horario: {
      id: disponibilidad.horario.id,
      descripcion: disponibilidad.horario.descripcion,
      start: disponibilidad.rango.start,
      end: disponibilidad.rango.end,
    },
    rangos: DATE_UTILITIES.generateRangesByInterval(disponibilidad.rangos, servicio.duracion),
  };
  return n;
};
