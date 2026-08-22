import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { RecursoFileOrm } from './recurso.file.orm';
import { EmpresaOrm, UsuarioOrm } from '@orm/seguridad';
import { ReservaOrm } from './reserva.orm';
import { HorarioOrm } from './horario.orm';

@Entity('RSVRECURSO')
export class RecursoOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'NOMBRE', length: 100 })
  nombreCompleto: string;

  @Column({ name: 'PERFILFILENAME', length: 30 })
  fileName: string;

  @Column({ name: 'PUNTAJEPROM', type: 'decimal', precision: 2, scale: 1 })
  puntajePromedio: number;

  @Column({ name: 'PUNTAJETOTAL', type: 'int' })
  puntajeTotal: number;

  @Column({ name: 'CANTICALIF', type: 'int' })
  cantidadCalificaciones: number;

  @Column({ name: 'ISACTIVA', default: true })
  isActivo: boolean;

  @Column({ name: 'GENEMPRESA' })
  empresaId: number;

  @ManyToOne(() => EmpresaOrm, empresa => empresa.recursos)
  @JoinColumn({ name: 'GENEMPRESA' })
  empresa: EmpresaOrm;

  @Column({ name: 'MAXTIMECANCEL', type: 'smallint' })
  maxTimePreviousCancelInMinutes: number;

  @OneToMany(() => RecursoFileOrm, file => file.recurso)
  files: RecursoFileOrm[];

  @OneToMany(() => ReservaOrm, reservas => reservas.recurso)
  reservas: ReservaOrm[];

  @OneToMany(() => HorarioOrm, horarios => horarios.recurso)
  horarios: HorarioOrm[];

  @ManyToMany(() => UsuarioOrm, usuario => usuario.recursos)
  usuarios: UsuarioOrm[];
}
