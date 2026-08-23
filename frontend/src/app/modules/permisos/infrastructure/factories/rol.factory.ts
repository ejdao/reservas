import { Rol, Permiso, tipoPermisoLevelFactory } from '../../domain/entities';
import { RolRes } from '../data-transfers';

export const dataToRolCollection = (data: RolRes[]) => {
  const roles: Rol[] = [];

  data.map((el) => {
    const permisos: Permiso[] = [];

    el.permisos.map((permiso) => {
      const newPermiso = new Permiso(
        permiso.id,
        tipoPermisoLevelFactory(3),
        permiso.codigo,
        permiso.nombre,
      );

      permisos.push(newPermiso);
    });

    const rol = new Rol(el.id, el.nombre, permisos);

    roles.push(rol);
  });

  return roles;
};
