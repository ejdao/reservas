import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { MunicipioOrm } from './municipio.orm';
import { PaisOrm } from './pais.orm';

@Entity('UBIDEPAR')
export class DepartamentoOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'CODIGO', length: 2 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @Column({ name: 'ACTIVO' })
  isActivo: boolean;

  @Column({ name: 'UBIPAIS' })
  paisId: number;

  @ManyToOne(() => PaisOrm, pais => pais.departamentos)
  @JoinColumn({ name: 'UBIPAIS' })
  pais: PaisOrm;

  @OneToMany(() => MunicipioOrm, municipio => municipio.departamento)
  municipios: MunicipioOrm[];
}
