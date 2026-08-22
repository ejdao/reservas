import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EstadoReservaCode, ESTADOS_RESERVA } from '@ctypes/reservas';
import { ServicioOrm } from './servicio.orm';
import { EmpresaOrm } from '@orm/seguridad';
import { RecursoOrm } from './recurso.orm';
import { ClienteOrm } from '@orm/general';
import { PagoOrm } from './pago.orm';

@Entity('RSVRESERVA')
export class ReservaOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'FECHAINICIO' })
  fechaInicio: Date;

  @Column({ name: 'FECHAFIN' })
  fechaFin: Date;

  @Column({ name: 'ESTADO', type: 'smallint', default: ESTADOS_RESERVA.PROGRAMADA.getCode() })
  estadoCode: EstadoReservaCode;

  @Column({ name: 'RSVSERVICIO' })
  servicioId: number;

  @ManyToOne(() => ServicioOrm, servicio => servicio.reservas)
  @JoinColumn({ name: 'RSVSERVICIO' })
  servicio: ServicioOrm;

  @Column({ name: 'GENCLIENTE' })
  clienteId: number;

  @ManyToOne(() => ClienteOrm, cliente => cliente.reservas)
  @JoinColumn({ name: 'GENCLIENTE' })
  cliente: ClienteOrm;

  @Column({ name: 'GENEMPRESA' })
  empresaId: number;

  @ManyToOne(() => EmpresaOrm, empresa => empresa.reservas)
  @JoinColumn({ name: 'GENEMPRESA' })
  empresa: EmpresaOrm;

  @Column({ name: 'RSVRESERVA', nullable: true })
  reservaId: number;

  @ManyToOne(() => ReservaOrm, reserva => reserva.reserva)
  @JoinColumn({ name: 'RSVRESERVA' })
  reserva: ReservaOrm;

  @Column({ name: 'RSVRECURSO' })
  recursoId: number;

  @ManyToOne(() => RecursoOrm, recurso => recurso.reservas)
  @JoinColumn({ name: 'RSVRECURSO' })
  recurso: RecursoOrm;

  @OneToMany(() => PagoOrm, pagos => pagos.reserva)
  pagos: PagoOrm[];
}
