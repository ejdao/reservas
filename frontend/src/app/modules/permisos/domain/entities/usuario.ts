import { Permiso } from './permiso';

export class Usuario {
  private _nombreRol: string;
  private _cantidadPermisos = 0;
  private _permisos: Permiso[] = [];

  constructor(
    private _id: string,
    private _nombreCompleto: string,
    private _numeroDocumento: string,
    private _rol: {
      id: string;
      name: string;
    },
  ) {
    this._nombreRol = _rol.name;
  }

  get id(): string {
    return this._id;
  }

  get nombreCompleto(): string {
    return this._nombreCompleto;
  }

  get numeroDocumento(): string {
    return this._numeroDocumento;
  }

  get permisos(): Permiso[] {
    return this._permisos;
  }

  get cantidadPermisos(): number {
    return this._cantidadPermisos;
  }

  get nombreRol(): string {
    return this._nombreRol;
  }

  set permisos(permisos: Permiso[]) {
    this._permisos = permisos;
    this._cantidadPermisos = permisos.length;
  }
}
