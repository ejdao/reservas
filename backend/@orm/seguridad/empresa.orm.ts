import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioOrm } from './usuario.orm';
import { ClienteOrm } from '@orm/general';
import { RecursoOrm, ReservaOrm, ServicioOrm } from '@orm/reservas';

@Entity('GENEMPRESA')
export class EmpresaOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'smallint' })
  id: number;

  @Column({ name: 'CODIGO', length: 10, unique: true })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @OneToMany(() => UsuarioOrm, usuario => usuario.empresas)
  usuarios: UsuarioOrm[];

  @OneToMany(() => ClienteOrm, cliente => cliente.empresa)
  clientes: ClienteOrm[];

  @OneToMany(() => RecursoOrm, recurso => recurso.empresa)
  recursos: RecursoOrm[];

  @OneToMany(() => ServicioOrm, servicio => servicio.empresa)
  servicios: ServicioOrm[];

  @OneToMany(() => ReservaOrm, reservas => reservas.empresa)
  reservas: ReservaOrm[];
}
