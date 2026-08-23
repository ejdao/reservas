import { Permiso } from './permiso';

export class Rol {
  constructor(
    private _id: string,
    private _nombre: string,
    private _permisos: Permiso[],
  ) {}

  get id() {
    return this._id;
  }

  get nombre() {
    return this._nombre;
  }

  get permisos() {
    return this._permisos;
  }

  set permisos(permisos: Permiso[]) {
    this._permisos = permisos;
  }
}
