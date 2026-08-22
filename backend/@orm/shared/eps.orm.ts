import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('GENEPS')
export class EpsOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'smallint' })
  id: number;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @Column({ name: 'NIT', length: 20 })
  nit: string;

  @Column({ name: 'FECHACIERRE', type: 'date', nullable: true })
  fechaCierre: Date;

  @Column({ name: 'ACTIVO', default: true })
  isActivo: boolean;
}
