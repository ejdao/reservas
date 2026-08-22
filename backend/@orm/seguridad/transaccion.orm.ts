import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoTransaccionOrm } from './tipo-transaccion.orm';
import { UsuarioOrm } from './usuario.orm';

@Entity('GENTRANSAC')
export class TransaccionOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'INFOADICIO', length: 300, nullable: true })
  informacionAdicional: string;

  @Column({ name: 'FECHREG' })
  fechaCreacion: Date;

  @Column({ name: 'ENTIRELACIO', type: 'int' })
  entidadRelacionadaId: number;

  @Column({ name: 'GENUSUARIO' })
  usuarioId: number;

  @Column({ name: 'GENTRANSACTIPO' })
  tipoTransaccionId: number;

  @ManyToOne(() => UsuarioOrm)
  @JoinColumn([{ name: 'GENUSUARIO', referencedColumnName: 'id' }])
  usuario: UsuarioOrm;

  @ManyToOne(() => TipoTransaccionOrm)
  @JoinColumn([{ name: 'GENTRANSACTIPO', referencedColumnName: 'id' }])
  tipoTransaccion: TipoTransaccionOrm;
}
