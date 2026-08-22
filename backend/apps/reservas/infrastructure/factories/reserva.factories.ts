import { ReservaOrm } from '@orm/reservas';
import { FetchReservaPagoRes, FetchReservaRes } from '../responses';
import { FILE_PATHS, FILE_PATHS as locations } from '@common/application/constants';
import { DATE_UTILITIES } from '@common/application/services';
import {
  estadoPagoTypeFactory,
  estadoReservaTypeFactory,
  tipoPagoTypeFactory,
} from '@ctypes/reservas';
import { ENVIRONMENTS as env } from 'src/app.environments';

export const reservaOrmToFetchReservaRes = (el: ReservaOrm) => {
  const res: FetchReservaRes = {
    id: el.id,
    fechaInicio: DATE_UTILITIES.manageTimeZone(el.fechaInicio, 'remove'),
    fechaFin: DATE_UTILITIES.manageTimeZone(el.fechaFin, 'remove'),
    estado: estadoReservaTypeFactory(el.estadoCode) as any,
    servicio: {
      id: el.servicio.id,
      nombre: el.servicio.nombre,
      descripcion: el.servicio.descripcion,
      valor: el.servicio.costo.valor,
    },
    cliente: el.cliente
      ? {
          id: el.cliente.id,
          nombreCompleto: el.cliente.nombreCompleto,
          numeroContacto: el.cliente.numeroContacto,
          email: el.cliente.email,
        }
      : undefined,
    recurso: {
      id: el.recurso.id,
      nombreCompleto: el.recurso.nombreCompleto,
      fileName: `${env.public}/${locations.reservas.recursos}/${el.recurso.fileName}`,
      puntajePromedio: el.recurso.puntajePromedio,
      puntajeTotal: el.recurso.puntajeTotal,
      cantidadCalificaciones: el.recurso.cantidadCalificaciones,
    },
    pagos: el.pagos.map(p => {
      const res: FetchReservaPagoRes = {
        id: p.id,
        tipo: tipoPagoTypeFactory(p.tipoPagoCode) as any,
        estado: estadoPagoTypeFactory(p.estadoPagoCode) as any,
        fechaCreacion: p.fechaCreacion,
        comprobanteFileName: p.comprobanteFileName
          ? `${env.public}/${FILE_PATHS.reservas.comprobantesPago}/${p.comprobanteFileName}`
          : null,
      };
      return res;
    }),
  };

  return res;
};
