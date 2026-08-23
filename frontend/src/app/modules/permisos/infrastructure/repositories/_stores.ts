import { BehaviorSubject } from 'rxjs';
import { Permiso, Rol, Usuario } from '../../domain/entities';
import { DataStored } from '../../domain/models';

export const usuariosSubj = new BehaviorSubject<DataStored<Usuario>>(new DataStored([], null));
export const usuariosObs$ = usuariosSubj.asObservable();

export const permisosSubj = new BehaviorSubject<DataStored<Permiso>>(new DataStored([], null));
export const permisosObs$ = permisosSubj.asObservable();

export const rolesSubj = new BehaviorSubject<DataStored<Rol>>(new DataStored([], null));
export const rolesObs$ = rolesSubj.asObservable();
