import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RecursoOrm } from './recurso.orm';

@Entity('RSVRECURSOFILES')
export class RecursoFileOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'FILENAME', length: 30 })
  fileName: string;

  @ManyToOne(() => RecursoOrm, recurso => recurso.files)
  @JoinColumn({ name: 'RSVRECURSO' })
  recurso: RecursoOrm;
}
