import { RSA_SERVICES } from '@common/application/services';
import { OnlyIdFromEntityRes } from '@seg/application/responses';

export * from './modulos.factories';
export * from './permiso.factories';
export * from './rol.factories';
export * from './usuario.factories';

export const idToOnlyIdFromEntityResFactory = (id: number, encryptId: boolean) => {
  const e = new OnlyIdFromEntityRes();
  e.id = (encryptId ? RSA_SERVICES.encryptValue(id) : id) as any;
  return e;
};
