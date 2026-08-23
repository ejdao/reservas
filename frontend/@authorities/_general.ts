const module = '001';

const subModules = {
  seguridad: `${module}001`,
};

export const ADMIN = `${subModules.seguridad}001`;

export const GEN_AUTHS = {
  code: module,
  seguridad: {
    code: subModules.seguridad,
    gestionarUsuarios: `${subModules.seguridad}002`,
    gestionarPermisos: `${subModules.seguridad}003`,
    crear: `${subModules.seguridad}004`,
  },
};
