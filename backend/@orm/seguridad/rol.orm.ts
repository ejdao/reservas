import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { PermisoOrm } from '../seguridad/permiso.orm';
import { UsuarioOrm } from './usuario.orm';

@Entity('GENROL')
export class RolOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'smallint' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 50 })
  nombre: string;

  @OneToMany(() => UsuarioOrm, user => user.rol)
  usuarios: UsuarioOrm[];

  @ManyToMany(() => PermisoOrm, authority => authority.roles)
  @JoinTable({
    name: 'GENSEGROLPER',
    joinColumn: { name: 'GENROL', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'GENSEGPERMISO', referencedColumnName: 'id' },
  })
  permisos: PermisoOrm[];
}
