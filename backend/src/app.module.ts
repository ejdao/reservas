import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { FILE_PATHS_ARR } from '@common/application/constants';
import { DATASOURCES } from './app.connections';
import { SharedModule } from '@shared/module';
import { SeguridadModule } from '@seg/module';
import { ReservasModule } from '@rsv/module';
import * as fs from 'fs';

@Module({
  imports: [ReservasModule, SeguridadModule, SharedModule],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    for (let index = 0; index < DATASOURCES.length; index++) {
      const el = DATASOURCES[index];
      const ctxForHumans = el.ctx.getForHumans();
      el.ds
        .initialize()
        .then(() => Logger.log(`${ctxForHumans} inicia correctamente`))
        .catch(err => Logger.log(`${ctxForHumans} no pudo iniciar, detalle: (${err.message})`));
    }

    fs.mkdir(`temp`, err => {
      if (err) return;
    });

    for (let index = 0; index < FILE_PATHS_ARR.length; index++) {
      const f = FILE_PATHS_ARR[index];
      const interval = setInterval(() => {
        if (!fs.existsSync(`public/${f}`) || !fs.existsSync(`removed/${f}`)) {
          fs.mkdir(`public/${f}`, { recursive: true }, err => {
            if (err) return;
          });
          fs.mkdir(`removed/${f}`, { recursive: true }, err => {
            if (err) return;
          });
        } else clearInterval(interval);
      }, 10);
    }
  }
}
