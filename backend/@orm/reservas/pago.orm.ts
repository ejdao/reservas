import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ESTADO_PAGOS, EstadoPagoCode, TipoPagoCode } from '@ctypes/reservas';
import { ReservaOrm } from './reserva.orm';
import { UsuarioOrm } from '@orm/seguridad';

@Entity('RSVRESERVAPAGO')
export class PagoOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'VALOR', type: 'decimal', precision: 9, scale: 2 })
  valor: number;

  @Column({ name: 'TIPOPAGO', type: 'smallint' })
  tipoPagoCode: TipoPagoCode;

  @Column({ name: 'ESTADOPAGO', type: 'smallint' })
  estadoPagoCode: EstadoPagoCode;

  @Column({ name: 'OBSERVVERIFPAG', length: 500, nullable: true })
  observaciones: string;

  @Column({ name: 'COMPROBANTE', length: 20, nullable: true })
  comprobanteFileName: string;

  @Column({ name: 'RSVRESERVA' })
  reservaId: number;

  @ManyToOne(() => ReservaOrm, reserva => reserva.pagos)
  @JoinColumn({ name: 'RSVRESERVA' })
  reserva: ReservaOrm;

  @Column({ name: 'FECHACREACION' })
  fechaCreacion: Date;

  @Column({ name: 'FECHAPAGO', nullable: true })
  fechaPago: Date;

  @Column({ name: 'FECHAVERIFICACION', nullable: true })
  fechaVerificacion: Date;

  @Column({ name: 'GENUSUARIOVERIFICADOR', nullable: true })
  verificadoPorId: number;

  @ManyToOne(() => UsuarioOrm)
  @JoinColumn({ name: 'GENUSUARIOVERIFICADOR' })
  verificadoPor: UsuarioOrm;
}
