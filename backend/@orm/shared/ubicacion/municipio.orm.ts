import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CorregimientoOrm } from './corregimiento.orm';
import { DepartamentoOrm } from './departamento.orm';
import { ZonaCode } from '@ctypes/shared/ubicacion';

@Entity('UBIMUNICI')
export class MunicipioOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @Column({ name: 'ZONA' })
  zonaCode: ZonaCode;

  @Column({ name: 'ACTIVO' })
  isActivo: boolean;

  @Column({ name: 'UBIDEPAR' })
  departamentoId: number;

  @ManyToOne(() => DepartamentoOrm, departamento => departamento.municipios)
  @JoinColumn({ name: 'UBIDEPAR' })
  departamento: DepartamentoOrm;

  @OneToMany(() => CorregimientoOrm, corregimiento => corregimiento.municipio)
  corregimientos: CorregimientoOrm[];
}
