import { RSA_SERVICES } from '@common/application/services';
import { FetchModuloRes, ModuloBasicoRes } from '@seg/application/responses';
import { ModuloOrm } from '@orm/seguridad';

export const moduloOrmToFetchModuloResFactory = (data: ModuloOrm) => {
  const e = new FetchModuloRes();
  e.id = RSA_SERVICES.encryptValue(data.id);
  e.codigo = data.codigo;
  e.nombre = data.nombre;
  e.subModulos = data.subModulos.map(s => {
    const sm = new ModuloBasicoRes();
    sm.id = RSA_SERVICES.encryptValue(s.id);
    sm.codigo = s.codigo;
    sm.nombre = s.nombre;
    return sm;
  });
  return e;
};
