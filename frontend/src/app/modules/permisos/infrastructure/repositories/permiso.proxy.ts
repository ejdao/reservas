import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { permisoResponseToCollection } from '../factories';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { permisosObs$, permisosSubj } from './_stores';
import { PermisoResponse } from '../data-transfers';
import { PermisoRepository } from '../../domain/repositories';
import { DataStored } from '../../domain/models';
import { Permiso } from '../../domain/entities';
import { SEG_END_POINTS } from '@end-points';

@Injectable()
export class PermisoProxyRepository implements PermisoRepository {
  constructor(private _http: HttpClient) {}

  public async fetch(refresh = false): Promise<Permiso[]> {
    if (permisosSubj.value.lastUpdate && !refresh) return permisosSubj.value.data;

    return firstValueFrom(
      this._http.get<{ permisos: PermisoResponse[] }>(SEG_END_POINTS.permisos).pipe(
        map((response) => permisoResponseToCollection(response.permisos)),
        tap((permisos) => {
          permisosSubj.next(
            new DataStored(permisosSubj.value.data.concat(...permisos), new Date()),
          );
        }),
      ),
    );
  }

  public observable(): Observable<DataStored<Permiso>> {
    return permisosObs$;
  }
}
