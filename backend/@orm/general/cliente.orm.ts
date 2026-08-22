import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EmpresaOrm } from '@orm/seguridad';
import { ReservaOrm } from '@orm/reservas';

@Entity('GENCLIENTE')
export class ClienteOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'NOMBRECOMPLETO', length: 200 })
  nombreCompleto: string;

  @Column({ name: 'NUMCONTACTO', length: 15 })
  numeroContacto: string;

  @Column({ name: 'EMAIL', length: 100 })
  email: string;

  @Column({ name: 'GENEMPRESA' })
  empresaId: number;

  @ManyToOne(() => EmpresaOrm, empresa => empresa.usuarios)
  @JoinColumn({ name: 'GENEMPRESA' })
  empresa: EmpresaOrm;

  @OneToMany(() => ReservaOrm, reservas => reservas.cliente)
  reservas: ReservaOrm[];
}
