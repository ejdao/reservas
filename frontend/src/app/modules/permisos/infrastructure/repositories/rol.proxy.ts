import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { dataToRolCollection } from '../factories/rol.factory';
import { rolesObs$, rolesSubj } from './_stores';
import { RolRes } from '../data-transfers';
import { Rol } from '../../domain/entities';
import { DataStored } from '../../domain/models';
import { RolRepository } from '../../domain/repositories';
import { SEG_END_POINTS } from '@end-points';

@Injectable()
export class RolProxyRepository implements RolRepository {
  constructor(private _http: HttpClient) {}

  public async fetch(refresh = false): Promise<Rol[]> {
    if (rolesSubj.value.lastUpdate && !refresh) return rolesSubj.value.data;

    return firstValueFrom(
      this._http
        .get<RolRes[]>(`${SEG_END_POINTS.roles}`, { params: { addComplements: true } })
        .pipe(
          map((response) => dataToRolCollection(response)),
          tap((data) => {
            rolesSubj.next(new DataStored(data, new Date()));
          }),
        ),
    );
  }

  public observable(): Observable<DataStored<Rol>> {
    return rolesObs$;
  }
}
