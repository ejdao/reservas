import { Injectable } from '@angular/core';
import { Either } from '@eklipse/ng-utilities';
import { PermisoRolService } from '../../application/services';
import { Permiso, Rol } from '../../domain/entities';

type Result = Either<boolean, boolean>;

@Injectable()
export class PermisoRolController {
  constructor(private _roles: PermisoRolService) {}

  public async add(permiso: Permiso, rol: Rol): Promise<Result> {
    try {
      const result = await this._roles.add(permiso, rol);
      return Either.right(result);
    } catch (error) {
      return Either.left(error);
    }
  }

  public async remove(permiso: Permiso, rol: Rol): Promise<Result> {
    try {
      const result = await this._roles.remove(permiso, rol);
      return Either.right(result);
    } catch (error) {
      return Either.left(error);
    }
  }
}
