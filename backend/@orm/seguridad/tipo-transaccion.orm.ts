import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('GENTRANSACTIPO')
export class TipoTransaccionOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'smallint' })
  id: number;

  @Column({ name: 'CODIGO', length: 9, unique: true })
  codigo: string;

  @Column({ name: 'DESCRIPCION', length: 150 })
  descripcion: string;

  @Column({ name: 'TABLA', length: 20 })
  tabla: string;
}
