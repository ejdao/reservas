import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource, Entity, PrimaryGeneratedColumn, QueryRunner, Repository } from 'typeorm';
import { EmpresaOrm, UsuarioOrm, TransaccionOrm, TipoTransaccionOrm } from '@orm/seguridad';
import { CTM_CONTEXTS, CtmContextType } from '@common/domain/types';
import { FetchPermisoRes } from '@seg/application/responses';
import { JWT_SERVICES, STRING_UTILITIES } from '@common/application/services';
import { fetchAuthorities, fetchAuthoritiesByUsuario } from './authorities';
import { switchConn } from 'src/app.connections';

@Entity('UNNAMED')
export class JustForVerifyOrm {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;
}

@Injectable()
export class BaseSource {
  protected conn: DataSource;
  protected qr: QueryRunner;
  protected sharedConn: DataSource;
  protected sharedQr: QueryRunner;

  constructor(@Inject(REQUEST) private _request: Request) {
    try {
      this.conn = switchConn(this.auth.context);
      this.qr = this.conn.createQueryRunner();
      this.sharedConn = switchConn(CTM_CONTEXTS.SHARED);
      this.sharedQr = this.sharedConn.createQueryRunner();
    } catch (error: any) {
      throw new UnauthorizedException('Requiere token de autenticación');
    }
  }

  protected dynamicConn(ctx: CtmContextType): DataSource {
    return switchConn(ctx);
  }

  protected dynamicQR(ctx: CtmContextType): QueryRunner {
    return switchConn(ctx).createQueryRunner();
  }

  protected async hasAnyAuthority(requiredAuths: string[], userAuths?: string[]): Promise<boolean> {
    if (!userAuths) {
      const res = await this.fetchAuthoritiesByUser(this.auth.id, this.auth.context);
      userAuths = res.onlyCodigos;
    }
    const hasAnyAuthority = () =>
      userAuths.some((authority: string) => requiredAuths.includes(authority));

    return hasAnyAuthority();
  }

  protected async verifyEntityExist(tablePath: string, id: number, qr?: QueryRunner) {
    let rp: Repository<JustForVerifyOrm>;
    if (!qr) rp = this.conn.getRepository(JustForVerifyOrm);
    else rp = qr.manager.getRepository(JustForVerifyOrm);
    rp.metadata.tablePath = tablePath;
    const result = await rp.findOne({ where: { id } });
    if (!result) throw new Error(`No existe ${tablePath} con este id`);
  }

  protected async getEnterprise(relations?: string[]) {
    const empresaRp = this.conn.getRepository(EmpresaOrm);
    const empresa = await empresaRp.findOne({
      where: { codigo: this.auth.enterpriseCode },
      relations,
    });
    return empresa;
  }

  protected get auth() {
    try {
      const tkDecoded = JWT_SERVICES.decode(this._request.headers.authorization.split(' ')[1]);

      const id = tkDecoded.getId();
      const enterpriseCode = tkDecoded.getEnterpriseCode();
      const document = tkDecoded.getDocument();
      const context = tkDecoded.getContext();
      const isUsuario = tkDecoded.getIsUsuario();
      const isCliente = tkDecoded.getIsCliente();

      return { id, enterpriseCode, document, context, isUsuario, isCliente };
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  }

  protected async generateTransaccion(
    codigo: string,
    entidadRelacionadaId: number,
    qr: QueryRunner,
    informacionAdicional?: string
  ) {
    const tipoTransaccionRp = qr.manager.getRepository(TipoTransaccionOrm);
    const transaccionRp = qr.manager.getRepository(TransaccionOrm);
    const usuarioRp = qr.manager.getRepository(UsuarioOrm);

    const tipoTransaccion = await tipoTransaccionRp.findOne({ where: { codigo } });
    const usuario = await usuarioRp.findOne({ where: { documento: this.auth.document } });

    if (!usuario) throw new Error('No existe un usuario con su documento en este contexto');

    const e = new TransaccionOrm();
    e.entidadRelacionadaId = entidadRelacionadaId;
    e.fechaCreacion = new Date();
    e.tipoTransaccionId = tipoTransaccion.id;
    if (usuario) e.usuarioId = usuario.id;
    e.informacionAdicional = STRING_UTILITIES.addEllipsis(informacionAdicional, 300);

    await transaccionRp.save(e);
  }

  protected async fetchAuthoritiesByUser(
    id: number,
    ctx: CtmContextType
  ): Promise<FetchPermisoRes> {
    return fetchAuthoritiesByUsuario(id, ctx);
  }

  protected async fetchAuthorities(ctx: CtmContextType): Promise<FetchPermisoRes> {
    return fetchAuthorities(ctx);
  }
}
