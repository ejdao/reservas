import { TipoPermisoLevel } from './values/tipo-permiso';

export class Permiso {
  private _isActive!: boolean;
  private _modulo!: string;
  private _submodulo!: string;
  private _isByRol!: boolean;

  constructor(
    private _id: string,
    private _tipo: TipoPermisoLevel,
    private _codigo: string,
    private _descripcion: string,
  ) {}

  get id(): string {
    return this._id;
  }

  get tipo(): TipoPermisoLevel {
    return this._tipo;
  }

  get modulo(): string {
    return this._modulo;
  }

  get submodulo(): string {
    return this._submodulo;
  }

  get codigo(): string {
    return this._codigo;
  }

  get descripcion(): string {
    return this._descripcion;
  }

  get isByRol() {
    return this._isByRol;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  set isByRol(isByRol: boolean) {
    this._isByRol = isByRol;
  }

  set modulo(modulo: string) {
    this._modulo = modulo;
  }

  set submodulo(submodulo: string) {
    this._submodulo = submodulo;
  }
}
