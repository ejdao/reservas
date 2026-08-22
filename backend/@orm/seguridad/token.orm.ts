import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioOrm } from './usuario.orm';

@Entity('GENSEGTOKEN')
export class TokenOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'TOKEN', length: 2000, nullable: true })
  token: string;

  @Column({ name: `ULTIACCESO` })
  ultimoAcceso: Date;

  @Column({ name: 'GENUSUARIO' })
  usuarioId: number;

  @ManyToOne(() => UsuarioOrm)
  @JoinColumn([{ name: 'GENUSUARIO', referencedColumnName: 'id' }])
  usuario: UsuarioOrm;
}
