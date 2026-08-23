import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Either } from '@eklipse/ng-utilities';
import { Permiso } from '../../domain/entities';
import { DataStored } from '../../domain/models';
import { PermisoRepository } from '../../domain/repositories';

type Result = Either<string, Permiso[]>;

@Injectable()
export class PermisoCrudController {
  constructor(private _usuarios: PermisoRepository) {}

  public async fetch(refresh = false): Promise<Result> {
    try {
      const permisos = await this._usuarios.fetch(refresh);
      return Either.right(permisos);
    } catch (error) {
      return Either.left(error);
    }
  }

  public observable(): Observable<DataStored<Permiso>> {
    return this._usuarios.observable();
  }
}
