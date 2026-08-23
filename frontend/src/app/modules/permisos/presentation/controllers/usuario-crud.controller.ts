import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Either } from '@eklipse/ng-utilities';
import { Usuario, Permiso } from '../../domain/entities';
import { DataStored } from '../../domain/models';
import { UsuarioRepository } from '../../domain/repositories';

type Result = Either<string, Usuario[]>;
type Result2 = Either<string, Permiso[]>;

@Injectable()
export class UsuarioCrudController {
  constructor(private _usuarios: UsuarioRepository) {}

  public async fetch(refresh: boolean): Promise<Result> {
    try {
      const result = await this._usuarios.fetch(refresh);
      return Either.right(result);
    } catch (error) {
      return Either.left(error);
    }
  }

  public async fetchPermisos(id: string): Promise<Result2> {
    try {
      const usuarios = await this._usuarios.fetchAuthorities(id);
      return Either.right(usuarios);
    } catch (error) {
      console.log(error);

      return Either.left(error);
    }
  }

  public observable(): Observable<DataStored<Usuario>> {
    return this._usuarios.observable();
  }
}
