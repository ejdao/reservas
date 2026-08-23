import { env } from '../@environments/environment';

export const apiUrlGen = `${env.serveHost}:3000`;

export const SEG_END_POINTS = {
  auth: `${apiUrlGen}/v1/auth/usuarios`,
  usuarios: `${apiUrlGen}/v1/seguridad/usuarios`,
  roles: `${apiUrlGen}/v1/seguridad/roles`,
  permisos: `${apiUrlGen}/v1/seguridad/permisos`,
  modulos: `${apiUrlGen}/v1/seguridad/modulos`,
  subModulos: `${apiUrlGen}/v1/seguridad/sub-modulos`,
};
