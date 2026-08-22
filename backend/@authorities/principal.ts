const codeModules = {
  gen: '001',
  rsv: '002',
};

export const MODULES = {
  GENERAL: {
    CODE: codeModules.gen,
    SUBS: {
      SEGURIDAD: `${codeModules.gen}001`,
    },
  },
  RESERVAS: { CODE: codeModules.rsv },
};
