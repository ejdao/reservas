import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SubModuloOrm } from './sub-modulo.orm';
import { PermisoOrm } from './permiso.orm';

@Entity('GENSEGMODULO')
export class ModuloOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'smallint' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 50 })
  nombre: string;

  @Column({ name: 'ACTIVO' })
  isActivo: boolean;

  @OneToMany(() => PermisoOrm, permiso => permiso.modulo)
  permisos: PermisoOrm[];

  @OneToMany(() => SubModuloOrm, subModulo => subModulo.modulo)
  subModulos: SubModuloOrm[];
}
