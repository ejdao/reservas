export type TipoPermisoCode = 1 | 2 | 3;

export class TipoPermisoLevel {
  constructor(
    private _code: TipoPermisoCode,
    private _label: string,
  ) {}

  public get code(): TipoPermisoCode {
    return this._code;
  }

  public get label(): string {
    return this._label;
  }
}

export const MODULO = new TipoPermisoLevel(1, 'Modulo');
export const SUBMODULO = new TipoPermisoLevel(2, 'Submodulo');
export const PERMISO = new TipoPermisoLevel(3, 'Permiso');

export function tipoPermisoLevelFactory(code: TipoPermisoCode): TipoPermisoLevel {
  switch (code) {
    case 1:
      return MODULO;
    case 2:
      return SUBMODULO;
    case 3:
      return PERMISO;
  }
}
