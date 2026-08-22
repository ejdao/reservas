import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ENVIRONMENTS } from './app.environments';
import { initSwagger } from './app.swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions = { cert: ENVIRONMENTS.rsa.https.cert, key: ENVIRONMENTS.rsa.https.key };

  const appOptions = ENVIRONMENTS.httpsIsActive ? { httpsOptions } : {};

  const app = await NestFactory.create<NestExpressApplication>(AppModule, appOptions);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useStaticAssets('./public', { prefix: '/public', index: false });

  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || ENVIRONMENTS.whiteList.indexOf(origin) >= 0) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  });

  if (ENVIRONMENTS.showDocs) initSwagger(app);

  await app.listen(ENVIRONMENTS.port);

  Logger.log(`Iniciado en puerto ${ENVIRONMENTS.port}`);
}
bootstrap();
