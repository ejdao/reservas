import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RecursoOrm } from './recurso.orm';

@Entity('RSVHORARIO')
export class HorarioOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'POSICION', type: 'smallint' })
  posicion: string;

  @Column({ name: 'DESCRIPCION', length: 100 })
  descripcion: string;

  @Column({ name: 'HORAINICIO1', type: 'smallint' })
  horaInicioLunes: number;

  @Column({ name: 'HORAFINAL1', type: 'smallint' })
  horaFinalLunes: number;

  @Column({ name: 'HBILTDO1', default: true })
  workOnLunes: boolean;

  @Column({ name: 'HORAINICIO2', type: 'smallint' })
  horaInicioMartes: number;

  @Column({ name: 'HORAFINAL2', type: 'smallint' })
  horaFinalMartes: number;

  @Column({ name: 'HBILTDO2', default: true })
  workOnMartes: boolean;

  @Column({ name: 'HORAINICIO3', type: 'smallint' })
  horaInicioMiercoles: number;

  @Column({ name: 'HORAFINAL3', type: 'smallint' })
  horaFinalMiercoles: number;

  @Column({ name: 'HBILTDO3', default: true })
  workOnMiercoles: boolean;

  @Column({ name: 'HORAINICIO4', type: 'smallint' })
  horaInicioJueves: number;

  @Column({ name: 'HORAFINAL4', type: 'smallint' })
  horaFinalJueves: number;

  @Column({ name: 'HBILTDO4', default: true })
  workOnJueves: boolean;

  @Column({ name: 'HORAINICIO5', type: 'smallint' })
  horaInicioViernes: number;

  @Column({ name: 'HORAFINAL5', type: 'smallint' })
  horaFinalViernes: number;

  @Column({ name: 'HBILTDO5', default: true })
  workOnViernes: boolean;

  @Column({ name: 'HORAINICIO6', type: 'smallint' })
  horaInicioSabado: number;

  @Column({ name: 'HORAFINAL6', type: 'smallint' })
  horaFinalSabado: number;

  @Column({ name: 'HBILTDO6', default: true })
  workOnSabado: boolean;

  @Column({ name: 'HORAINICIO0', type: 'smallint' })
  horaInicioDomingo: number;

  @Column({ name: 'HORAFINAL0', type: 'smallint' })
  horaFinalDomingo: number;

  @Column({ name: 'HBILTDO0', default: false })
  workOnDomingo: boolean;

  @Column({ name: 'RSVRECURSO' })
  recursoId: number;

  @ManyToOne(() => RecursoOrm, recurso => recurso.horarios)
  @JoinColumn({ name: 'RSVRECURSO' })
  recurso: RecursoOrm;
}
