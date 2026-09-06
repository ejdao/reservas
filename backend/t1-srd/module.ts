import { Module } from '@nestjs/common';
import { GeneralModule } from './general/module';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { FileSaverModule } from './file-saver';

export const SRD_MODULES = [FileSaverModule, GeneralModule, UbicacionModule];

@Module({ imports: SRD_MODULES })
export class SharedModule {}
