import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { PermisoOrm } from './permiso.orm';
import { ModuloOrm } from './modulo.orm';

@Entity('GENSEGSUBMODO')
export class SubModuloOrm {
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

  @ManyToOne(() => ModuloOrm, module => module.permisos)
  @JoinColumn({ name: 'GENSEGMODULO' })
  modulo: ModuloOrm;

  @OneToMany(() => PermisoOrm, permiso => permiso.subModulo)
  permisos: PermisoOrm[];
}
