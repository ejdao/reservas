import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { MunicipioOrm } from './municipio.orm';

@Entity('UBICORREG')
export class CorregimientoOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @Column({ name: 'TIPO', length: 2 })
  tipo: string;

  @Column({ name: 'LATITUD', type: 'double precision', nullable: true })
  latitud: number;

  @Column({ name: 'LONGITUD', type: 'double precision', nullable: true })
  longitud: number;

  @Column({ name: 'ACTIVO' })
  isActivo: boolean;

  @Column({ name: 'UBIMUNICI' })
  municipioId: number;

  @ManyToOne(() => MunicipioOrm, municipios => municipios.corregimientos)
  @JoinColumn({ name: 'UBIMUNICI' })
  municipio: MunicipioOrm;
}
