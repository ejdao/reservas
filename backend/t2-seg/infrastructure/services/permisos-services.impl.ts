import { BadRequestException, Injectable } from '@nestjs/common';
import { FetchPermisoRes } from '@seg/application/responses';
import { BaseSource } from '@common/infrastructure/services';
import { RSA_SERVICES } from '@common/application/services';
import { PermisoOrm, UsuarioOrm, RolOrm } from '@orm/seguridad';

@Injectable()
export class PermisosServicesImpl extends BaseSource {
  public async fetchByUsuario(id: string): Promise<FetchPermisoRes> {
    try {
      const permisos = await this.fetchAuthoritiesByUser(
        +RSA_SERVICES.decryptValue(id),
        this.auth.context
      );

      return permisos;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async addPermisoToUsuario(permisoId: string, usuarioId: string): Promise<boolean> {
    await this.qr.connect();
    try {
      await this.qr.startTransaction();

      const permisoRp = this.qr.manager.getRepository(PermisoOrm);
      const usuarioRp = this.qr.manager.getRepository(UsuarioOrm);

      const permisoIdDcd = +RSA_SERVICES.decryptValue(permisoId);
      const usuarioIdDcd = +RSA_SERVICES.decryptValue(usuarioId);

      const permiso = await permisoRp.findOne({
        where: { id: permisoIdDcd },
      });
      if (!permiso) throw new Error('Este permiso no existe o no está disponible en esta empresa');

      const usuario = await usuarioRp.findOne({
        where: { id: usuarioIdDcd, empresas: { codigo: this.auth.enterpriseCode } },
        relations: ['permisos'],
      });
      if (!usuario) throw new Error('Este usuario no existe para esta empresa');

      usuario.permisos.push(permiso);

      await usuarioRp.save(usuario);

      await this.qr.commitTransaction();

      return true;
    } catch (error: any) {
      await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await this.qr.release();
    }
  }

  public async removePermisoToUsuario(permisoId: string, usuarioId: string): Promise<boolean> {
    await this.qr.connect();
    try {
      await this.qr.startTransaction();

      const permisoRp = this.qr.manager.getRepository(PermisoOrm);
      const usuarioRp = this.qr.manager.getRepository(UsuarioOrm);

      const permisoIdDcd = +RSA_SERVICES.decryptValue(permisoId);
      const usuarioIdDcd = +RSA_SERVICES.decryptValue(usuarioId);

      const permiso = await permisoRp.findOne({
        where: { id: +permisoIdDcd },
      });
      if (!permiso) throw new Error('Este permiso no existe o no está disponible en esta empresa');

      const usuario = await usuarioRp.findOne({
        where: { id: usuarioIdDcd, empresas: { codigo: this.auth.enterpriseCode } },
        relations: ['permisos'],
      });
      if (!usuario) throw new Error('Este usuario no existe');

      usuario.permisos = usuario.permisos.filter(authority => {
        return authority.id !== permiso.id;
      });

      await usuarioRp.save(usuario);

      await this.qr.commitTransaction();

      return true;
    } catch (error: any) {
      await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await this.qr.release();
    }
  }

  public async addPermisoToRol(permisoId: string, rolId: string): Promise<boolean> {
    await this.qr.connect();
    try {
      await this.qr.startTransaction();

      const permisoRp = this.qr.manager.getRepository(PermisoOrm);
      const rolRp = this.qr.manager.getRepository(RolOrm);

      const permisoIdDcd = +RSA_SERVICES.decryptValue(permisoId);
      const rolIdDcd = +RSA_SERVICES.decryptValue(rolId);

      const permiso = await permisoRp.findOne({
        where: { id: permisoIdDcd },
      });
      if (!permiso) throw new Error('Este permiso no existe o no está disponible en esta empresa');

      const rol = await rolRp.findOne({ where: { id: rolIdDcd }, relations: ['permisos'] });
      if (!rol) throw new Error('Este rol no existe');

      rol.permisos.push(permiso);

      await rolRp.save(rol);

      await this.qr.commitTransaction();

      return true;
    } catch (error: any) {
      await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await this.qr.release();
    }
  }

  public async removePermisoToRol(permisoId: string, rolId: string): Promise<boolean> {
    await this.qr.connect();
    try {
      await this.qr.startTransaction();

      const permisoRp = this.qr.manager.getRepository(PermisoOrm);
      const rolRp = this.qr.manager.getRepository(RolOrm);

      const permisoIdDcd = +RSA_SERVICES.decryptValue(permisoId);
      const rolIdDcd = +RSA_SERVICES.decryptValue(rolId);

      const permiso = await permisoRp.findOne({ where: { id: permisoIdDcd } });
      if (!permiso) throw new Error('Este permiso no existe o no está disponible en esta empresa');

      const rol = await rolRp.findOne({ where: { id: rolIdDcd }, relations: ['permisos'] });
      if (!rol) throw new Error('Este rol no existe para esta empresa');

      rol.permisos = rol.permisos.filter(authority => {
        return authority.id !== permiso.id;
      });

      await rolRp.save(rol);

      await this.qr.commitTransaction();

      return true;
    } catch (error: any) {
      await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await this.qr.release();
    }
  }
}
