import { Observable } from 'rxjs';
import { Permiso, Usuario } from '../entities';
import { DataStored } from '../models';

export abstract class UsuarioRepository {
  abstract fetch(refresh: boolean): Promise<Usuario[]>;
  abstract fetchAuthorities(id: string): Promise<Permiso[]>;
  abstract observable(): Observable<DataStored<Usuario>>;
}
