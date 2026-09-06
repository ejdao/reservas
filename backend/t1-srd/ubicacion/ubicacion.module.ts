import { Module } from '@nestjs/common';
import {
  CorregimientoCrudSource,
  DepartamentoCrudSource,
  MunicipioCrudSource,
  PaisCrudSource,
} from './infrastructure/repositories';
import {
  CorregimientosCrudController,
  DepartamentosCrudController,
  MunicipiosCrudController,
  PaisesCrudController,
} from './presentation/controllers';

@Module({
  controllers: [
    PaisesCrudController,
    DepartamentosCrudController,
    MunicipiosCrudController,
    CorregimientosCrudController,
  ],
  providers: [PaisCrudSource, DepartamentoCrudSource, MunicipioCrudSource, CorregimientoCrudSource],
})
export class UbicacionModule {}
