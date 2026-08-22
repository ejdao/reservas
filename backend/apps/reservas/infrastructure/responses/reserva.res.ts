import { CtmTypeRes } from '@common/application/responses';
import { ApiProperty } from '@nestjs/swagger';

export class FetchReservaServicioRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  descripcion: string;
  @ApiProperty()
  valor: number;
}

export class FetchReservaClienteRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nombreCompleto: string;
  @ApiProperty()
  numeroContacto: string;
  @ApiProperty()
  email: string;
}

export class FetchReservaRecursoRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nombreCompleto: string;
  @ApiProperty()
  fileName: string;
  @ApiProperty()
  puntajePromedio: number;
  @ApiProperty()
  puntajeTotal: number;
  @ApiProperty()
  cantidadCalificaciones: number;
}

export class FetchReservaPagoRes {
  @ApiProperty()
  id: number;
  @ApiProperty({ type: CtmTypeRes })
  tipo: CtmTypeRes;
  @ApiProperty({ type: CtmTypeRes })
  estado: CtmTypeRes;
  @ApiProperty()
  fechaCreacion: Date;
  @ApiProperty()
  comprobanteFileName: string;
}

export class FetchReservaRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  fechaInicio: Date;
  @ApiProperty()
  fechaFin: Date;
  @ApiProperty({ type: CtmTypeRes })
  estado: CtmTypeRes;
  @ApiProperty({ type: FetchReservaServicioRes })
  servicio: FetchReservaServicioRes;
  @ApiProperty({ type: FetchReservaClienteRes })
  cliente: FetchReservaClienteRes;
  @ApiProperty({ type: FetchReservaRecursoRes })
  recurso: FetchReservaRecursoRes;
  @ApiProperty({ type: FetchReservaPagoRes, isArray: true })
  pagos: FetchReservaPagoRes[];
}
