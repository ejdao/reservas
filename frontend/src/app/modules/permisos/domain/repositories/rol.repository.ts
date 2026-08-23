import { Observable } from 'rxjs';
import { Rol } from '../entities';
import { DataStored } from '../models';

export abstract class RolRepository {
  abstract fetch(refresh: boolean): Promise<Rol[]>;
  abstract observable(): Observable<DataStored<Rol>>;
}
