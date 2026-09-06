import { uniq } from 'lodash';
import { BadRequestException } from '@nestjs/common';
import { UsuarioOrm, PermisoOrm } from '@orm/seguridad';
import { RSA_SERVICES } from '@common/application/services';
import { CtmContextType } from '@common/domain/types';
import { FetchPermisoRes } from '@seg/application/responses';
import { switchConn } from '@connections';

export const fetchAuthoritiesByUsuario = async (
  id: number,
  ctx: CtmContextType
): Promise<FetchPermisoRes> => {
  try {
    const conn = switchConn(ctx);

    const usuarioRp = conn.getRepository(UsuarioOrm);
    const usuario = await usuarioRp.findOne({
      where: { id },
      relations: [
        'permisos',
        'permisos.modulo',
        'permisos.subModulo',
        'rol',
        'rol.permisos',
        'rol.permisos.modulo',
        'rol.permisos.subModulo',
      ],
    });

    const permisos: PermisoOrm[] = [];

    const permisosByUsuario = usuario.permisos.map(el => {
      el.isFromUsuario = true;
      let permiso = '';

      if (el.modulo) {
        permiso += el.modulo.codigo;
        el.isActivo = el.modulo.isActivo;
      } else {
        delete el.modulo;
      }

      if (el.subModulo) {
        permiso += el.subModulo.codigo;
        el.isActivo = el.subModulo.isActivo;
      } else {
        delete el.subModulo;
      }

      permiso += el.codigo;

      if (el.isActivo) {
        el.codigo = permiso;
        return el;
      } else {
        return null;
      }
    });

    const permisosByRol = usuario.rol.permisos.map(el => {
      el.isFromRol = true;
      let permiso = '';

      if (el.modulo) {
        permiso += el.modulo.codigo;
        el.isActivo = el.modulo.isActivo;
      } else {
        delete el.modulo;
        delete el.moduloId;
      }

      if (el.subModulo) {
        permiso += el.subModulo.codigo;
        el.isActivo = el.subModulo.isActivo;
      } else {
        delete el.subModulo;
        delete el.subModuloId;
      }

      permiso += el.codigo;

      if (el.isActivo) {
        el.codigo = permiso;
        return el;
      } else {
        return null;
      }
    });

    permisos.push(
      ...uniq([
        ...permisosByUsuario.filter(el => el !== null),
        ...permisosByRol.filter(el => el !== null),
      ])
    );

    const codigos: string[] = [];

    permisos.map(el => {
      if (el.modulo) {
        delete el.modulo.isActivo;
        codigos.push(el.modulo.codigo);
        el.modulo.id = RSA_SERVICES.encryptValue(el.modulo.id) as any;
        delete el.moduloId;
      }
      if (el.subModulo) {
        delete el.subModulo.isActivo;
        codigos.push(`${el.modulo.codigo}${el.subModulo.codigo}`);
        el.subModulo.id = RSA_SERVICES.encryptValue(el.subModulo.id) as any;
        delete el.subModulo.moduloId;
        delete el.subModuloId;
      }
      codigos.push(el.codigo);
      delete el.isActivo;
      el.id = RSA_SERVICES.encryptValue(el.id) as any;
    });

    return { permisos, onlyCodigos: uniq(codigos) };
  } catch (error: any) {
    throw new BadRequestException(error.message);
  }
};

export const fetchAuthorities = async (ctx: CtmContextType): Promise<FetchPermisoRes> => {
  try {
    const conn = switchConn(ctx);

    const permisoRp = conn.getRepository(PermisoOrm);

    const allPermisos = await permisoRp.find({ relations: ['modulo', 'subModulo'] });

    const permisos = allPermisos.map(el => {
      delete el.isFromRol;
      delete el.isFromUsuario;
      let permiso = '';

      if (el.modulo) {
        permiso += el.modulo.codigo;
        el.isActivo = el.modulo.isActivo;
      } else {
        delete el.modulo;
        delete el.moduloId;
      }

      if (el.subModulo) {
        permiso += el.subModulo.codigo;
        el.isActivo = el.subModulo.isActivo;
      } else {
        delete el.subModulo;
        delete el.subModuloId;
      }

      permiso += el.codigo;

      if (el.isActivo) {
        el.codigo = permiso;
        return el;
      } else {
        return null;
      }
    });

    const codigos: string[] = [];

    const permisosFiltered = permisos.filter(el => el !== null);

    permisosFiltered.map(el => {
      if (el.modulo) {
        delete el.modulo.isActivo;
        codigos.push(el.modulo.codigo);
        el.modulo.id = RSA_SERVICES.encryptValue(el.modulo.id) as any;
        delete el.moduloId;
      }
      if (el.subModulo) {
        delete el.subModulo.isActivo;
        codigos.push(`${el.modulo.codigo}${el.subModulo.codigo}`);
        el.subModulo.id = RSA_SERVICES.encryptValue(el.subModulo.id) as any;
        delete el.subModulo.moduloId;
        delete el.subModuloId;
      }
      codigos.push(el.codigo);
      delete el.isActivo;
      el.id = RSA_SERVICES.encryptValue(el.id) as any;
    });

    return { permisos: permisosFiltered, onlyCodigos: uniq(codigos) };
  } catch (error: any) {
    throw new BadRequestException(error.message);
  }
};
