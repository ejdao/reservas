import { PermisoOrm } from '@orm/seguridad';
import { ModuloBasicoRes } from '@seg/application/responses';
import { RSA_SERVICES } from '@common/application/services';

export const permisoOrmToModuloBasicoResFactory = (data: PermisoOrm): ModuloBasicoRes => {
  const e = new ModuloBasicoRes();
  e.id = RSA_SERVICES.encryptValue(data.id);
  e.codigo = data.codigo;
  e.nombre = data.nombre;
  return e;
};
