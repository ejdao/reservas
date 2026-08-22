import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { SubModuloOrm } from './sub-modulo.orm';
import { UsuarioOrm } from './usuario.orm';
import { ModuloOrm } from './modulo.orm';
import { RolOrm } from './rol.orm';

@Entity('GENSEGPERMISO')
export class PermisoOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'smallint' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 50 })
  nombre: string;

  @Column({ name: 'ACTIVO' })
  isActivo: boolean;

  @Column({ name: 'GENSEGMODULO' })
  moduloId: number;

  @Column({ name: 'GENSEGSUBMODO' })
  subModuloId: number;

  @ManyToOne(() => ModuloOrm, modulo => modulo.permisos)
  @JoinColumn({ name: 'GENSEGMODULO' })
  modulo: ModuloOrm;

  @ManyToOne(() => SubModuloOrm, subModulo => subModulo.permisos)
  @JoinColumn({ name: 'GENSEGSUBMODO' })
  subModulo: SubModuloOrm;

  @ManyToMany(() => RolOrm, rol => rol.permisos)
  roles: RolOrm[];

  @ManyToMany(() => UsuarioOrm, usuario => usuario.permisos)
  usuarios: UsuarioOrm[];

  isFromUsuario = false;
  isFromRol = false;
}
