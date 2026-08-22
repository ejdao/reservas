import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CostoServicioOrm } from './servicio.costo.orm';
import { EmpresaOrm } from '@orm/seguridad';
import { ReservaOrm } from './reserva.orm';

@Entity('RSVSERVICIO')
export class ServicioOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @Column({ name: 'DESCRIPCION', length: 500, nullable: true })
  descripcion: string;

  @Column({ name: 'DURACIONMTS', default: 0 })
  duracion: number;

  @Column({ name: 'ISACTIVA', default: true })
  isActivo: boolean;

  @Column({ name: 'GENEMPRESA' })
  empresaId: number;

  @ManyToOne(() => EmpresaOrm, empresa => empresa.servicios)
  @JoinColumn({ name: 'GENEMPRESA' })
  empresa: EmpresaOrm;

  @Column({ name: 'RSVSERVICIOCOSTO' })
  costoId: number;

  @ManyToOne(() => CostoServicioOrm, costo => costo.servicio)
  @JoinColumn({ name: 'RSVSERVICIOCOSTO' })
  costo: CostoServicioOrm;

  @OneToMany(() => ReservaOrm, reservas => reservas.servicio)
  reservas: ReservaOrm[];
}
