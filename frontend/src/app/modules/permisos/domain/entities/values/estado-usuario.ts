export type EstadoUsuarioCode = 1;

export class EstadoUsuarioLevel {
  constructor(
    private _code: EstadoUsuarioCode,
    private _label: string,
  ) {}

  public get code(): EstadoUsuarioCode {
    return this._code;
  }

  public get label(): string {
    return this._label;
  }
}

export const ACTIVO = new EstadoUsuarioLevel(1, 'Activo');

export function estadoUsuarioLevelFactory(code: EstadoUsuarioCode): EstadoUsuarioLevel {
  switch (code) {
    case 1:
      return ACTIVO;
  }
}
