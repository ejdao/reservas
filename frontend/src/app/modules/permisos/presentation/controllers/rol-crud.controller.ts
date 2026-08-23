import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Either } from '@eklipse/ng-utilities';
import { Rol } from '../../domain/entities';
import { DataStored } from '../../domain/models';
import { RolRepository } from '../../domain/repositories';

type Result = Either<string, Rol[]>;

@Injectable()
export class RolCrudController {
  constructor(private _roles: RolRepository) {}

  public async fetch(refresh = false): Promise<Result> {
    try {
      const roles = await this._roles.fetch(refresh);
      return Either.right(roles);
    } catch (error) {
      console.log(error);
      return Either.left(error);
    }
  }

  public observable(): Observable<DataStored<Rol>> {
    return this._roles.observable();
  }
}
