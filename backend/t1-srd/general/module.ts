import { Module } from '@nestjs/common';
import { RecursosController } from './presentation/controllers';
import { RecursosImpl } from './infrastructure/services';

@Module({
  controllers: [RecursosController],
  providers: [RecursosImpl],
})
export class GeneralModule {}
