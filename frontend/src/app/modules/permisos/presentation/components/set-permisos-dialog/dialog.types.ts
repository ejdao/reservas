import { InjectionToken } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Permiso, Rol, Usuario } from '../../../domain/entities';

export type PermissionEntityType = 'usuario' | 'rol';
export type PermissionVersion = 'standard' | 'enlaces-externos' | 'gemi';

export interface SetPermisosDialogData<TEntity extends Usuario | Rol = Usuario | Rol> {
  data: TEntity;
  tipoEntidad: PermissionEntityType;
  version: PermissionVersion;
}

export interface SetPermisosDialogResult<TEntity extends Usuario | Rol = Usuario | Rol> {
  data: TEntity;
  permisos: Permiso[];
}

export class SetPermisosDialogRef<TEntity extends Usuario | Rol = Usuario | Rol> {
  private readonly _closed$ = new ReplaySubject<SetPermisosDialogResult<TEntity> | undefined>(1);
  private _closed = false;

  public afterClosed(): Observable<SetPermisosDialogResult<TEntity> | undefined> {
    return this._closed$.asObservable();
  }

  public close(result?: SetPermisosDialogResult<TEntity>): void {
    if (this._closed) return;

    this._closed = true;
    this._closed$.next(result);
    this._closed$.complete();
  }
}

export const SET_PERMISOS_DIALOG_DATA = new InjectionToken<SetPermisosDialogData>(
  'SET_PERMISOS_DIALOG_DATA',
);
