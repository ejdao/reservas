import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { permisoResponseToEntity } from '../factories';
import { usuariosObs$, usuariosSubj } from './_stores';
import { PermisoResponse } from '../data-transfers';
import { SEG_END_POINTS } from '@end-points';
import { UsuarioRepository } from '../../domain/repositories';
import { Permiso, Usuario } from '../../domain/entities';
import { DataStored } from '../../domain/models';

interface UsuarioI {
  id: string;
  primerNombre: string;
  primerApellido: string;
  documento: string;
  rol: {
    id: string;
    nombre: string;
  };
}

@Injectable()
export class UsuarioProxyRepository implements UsuarioRepository {
  constructor(private _http: HttpClient) {}

  async fetch(refresh: boolean): Promise<Usuario[]> {
    if (usuariosSubj.value.lastUpdate && !refresh) return usuariosSubj.value.data;

    const data = await firstValueFrom(
      this._http.get<UsuarioI[]>(`${SEG_END_POINTS.usuarios}`).pipe(
        map((res) => {
          return res.map((el) => {
            return new Usuario(el.id, `${el.primerNombre} ${el.primerApellido}`, el.documento, {
              id: el.rol.id,
              name: el.rol.nombre,
            });
          });
        }),
      ),
    );

    usuariosSubj.next(new DataStored(data, new Date()));

    return data;
  }

  fetchAuthorities(id: string): Promise<Permiso[]> {
    return firstValueFrom(
      this._http
        .get<{ permisos: PermisoResponse[] }>(`${SEG_END_POINTS.permisos}/by-usuario/${id}`)
        .pipe(map((response) => response.permisos.map((res) => permisoResponseToEntity(res)))),
    );
  }

  observable(): Observable<DataStored<Usuario>> {
    return usuariosObs$;
  }
}
