import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ServicioOrm } from './servicio.orm';

@Entity('RSVSERVICIOCOSTO')
export class CostoServicioOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'ANTICIPO', type: 'decimal', precision: 9, scale: 2 })
  anticipo: number;

  @Column({ name: 'VALOR', type: 'decimal', precision: 9, scale: 2 })
  valor: number;

  @Column({ name: 'RSVSERVICIO' })
  servicioId: number;

  @ManyToOne(() => ServicioOrm, servicio => servicio.costo)
  @JoinColumn({ name: 'RSVSERVICIO' })
  servicio: ServicioOrm;
}
