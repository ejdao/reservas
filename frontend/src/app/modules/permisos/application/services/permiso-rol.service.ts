import { Permiso, Rol } from '../../domain/entities';

export abstract class PermisoRolService {
  abstract add(permiso: Permiso, rol: Rol): Promise<boolean>;
  abstract remove(permiso: Permiso, rol: Rol): Promise<boolean>;
}
