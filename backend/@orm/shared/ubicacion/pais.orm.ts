import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DepartamentoOrm } from './departamento.orm';

@Entity('UBIPAIS')
export class PaisOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'smallint' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 50 })
  nombre: string;

  @Column({ name: 'IDIOMA', length: 20 })
  idioma: string;

  @Column({ name: 'CODNUM', length: 3 })
  codigoNumerico: string;

  @Column({ name: 'CODIDIO', length: 2 })
  codigoIdioma: string;

  @Column({ name: 'CODALFA', length: 2 })
  codigoAlfa: string;

  @Column({ name: 'ACTIVO' })
  isActivo: boolean;

  @OneToMany(() => DepartamentoOrm, departamento => departamento.pais)
  departamentos: DepartamentoOrm[];
}
