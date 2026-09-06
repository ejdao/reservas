import { RSA_SERVICES } from '@common/application/services';
import { ApiProperty } from '@nestjs/swagger';

export class RecursoRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  codigo: string;
  @ApiProperty()
  nombre: string;
}

export const entidadOrmToRes = (
  e: any,
  isIdEncrypted: boolean,
  data?: { id?: string; codigo?: string; nombre?: string }
) => {
  if (!data) data = {};
  const id = data.id ? e[data.id] : e.id;
  const r = new RecursoRes();
  r.id = isIdEncrypted ? RSA_SERVICES.encryptValue(id) : id;
  r.codigo = data.codigo ? e[data.codigo] : e.codigo;
  r.nombre = data.nombre ? e[data.nombre] : e.nombre;
  return r;
};
