import {
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  JoinTable,
  Column,
  Entity,
} from 'typeorm';
import { EstadoUsuarioCode, TipoDocUsuarioCode } from '@ctypes/general/usuario';
import { PermisoOrm } from '../seguridad/permiso.orm';
import { EmpresaOrm } from './empresa.orm';
import { RolOrm } from './rol.orm';
import { RecursoOrm } from '@orm/reservas';

@Entity('GENUSUARIO')
export class UsuarioOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'TIPODOC', type: 'smallint' })
  tipoDocumentoCode: TipoDocUsuarioCode;

  @Column({ name: 'DOCUME', length: 15, unique: true })
  documento: string;

  @Column({ name: 'PRINOMBRE', length: 100 })
  primerNombre: string;

  @Column({ name: 'SEGNOMBRE', length: 100, nullable: true })
  segundoNombre: string;

  @Column({ name: 'PRIAPELLIDO', length: 100 })
  primerApellido: string;

  @Column({ name: 'SEGAPELLIDO', length: 100, nullable: true })
  segundoApellido: string;

  @Column({ name: 'NUMCONTACPRIN', length: 15, nullable: true })
  numeroContactoPrincipal: string;

  @Column({ name: 'NUMCONTACSECU', length: 15, nullable: true })
  numeroContactoSecundario: string;

  @Column({ name: 'EMAIL', length: 50, nullable: true, unique: true })
  email: string;

  @Column({ name: 'CONTRA', length: 60, select: false })
  password: string;

  @Column({ name: `ULTIACCESO`, nullable: true })
  ultimoAcceso: Date;

  @Column({ name: 'ESTADO', type: 'smallint' })
  estadoCode: EstadoUsuarioCode;

  @Column({ name: 'PASSRESETED' })
  isPasswordReiniciada: boolean;

  @Column({ name: 'GENROL' })
  rolId: number;

  @ManyToOne(() => RolOrm, role => role.usuarios)
  @JoinColumn({ name: 'GENROL' })
  rol: RolOrm;

  @ManyToMany(() => EmpresaOrm, empresa => empresa.usuarios)
  @JoinTable({
    name: 'GENUSUARIOEMPRESA',
    joinColumn: { name: 'GENUSUARIO', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'GENEMPRESA', referencedColumnName: 'id' },
  })
  empresas: EmpresaOrm[];

  @ManyToMany(() => PermisoOrm, permiso => permiso.usuarios)
  @JoinTable({
    name: 'GENSEGUSUPER',
    joinColumn: { name: 'GENUSUARIO', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'GENSEGPERMISO', referencedColumnName: 'id' },
  })
  permisos: PermisoOrm[];

  @ManyToMany(() => RecursoOrm, recurso => recurso.usuarios)
  @JoinTable({
    name: 'RSVGENRECUSU',
    joinColumn: { name: 'GENUSUARIO', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'RSVRECURSO', referencedColumnName: 'id' },
  })
  recursos: RecursoOrm[];
}
