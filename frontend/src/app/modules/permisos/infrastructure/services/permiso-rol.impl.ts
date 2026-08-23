import { firstValueFrom, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PermisoResponse } from '../data-transfers';
import { PermisoRolService } from '../../application/services';
import { Permiso, Rol } from '../../domain/entities';
import { SEG_END_POINTS } from '@end-points';

@Injectable()
export class PermisoRolImpl implements PermisoRolService {
  constructor(private _http: HttpClient) {}

  public add(permiso: Permiso, rol: Rol): Promise<boolean> {
    return firstValueFrom(
      this._http
        .get<PermisoResponse>(
          `${SEG_END_POINTS.permisos}/add-permiso-to-rol/${permiso.id}/${rol.id}`,
        )
        .pipe(
          map((response) => {
            if (response) return true;
            else return false;
          }),
        ),
    );
  }

  public remove(permiso: Permiso, rol: Rol): Promise<boolean> {
    return firstValueFrom(
      this._http.get<boolean>(
        `${SEG_END_POINTS.permisos}/remove-permiso-to-rol/${permiso.id}/${rol.id}`,
      ),
    );
  }
}
