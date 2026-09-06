import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeguridadModule } from '@seg/module';
import { SRD_MODULES } from '@shared/module';

const title = 'Proyecto Base';

const config = [
  { name: 'Seguridad', url: 'docs/seguridad', version: '1.0', modules: [SeguridadModule] },
  { name: 'Shared', url: 'docs/shared', version: '1.0', modules: SRD_MODULES },
];

export const initSwagger = (app: INestApplication) => {
  const principalOptions = new DocumentBuilder().setTitle(title).setVersion('1.0').build();
  const principalDocument = SwaggerModule.createDocument(app, principalOptions);
  const swaggerOptionsUrls: { name: string; url: string }[] = [];

  config.forEach(el => swaggerOptionsUrls.push({ name: el.name, url: `${el.url}/swagger.json` }));

  SwaggerModule.setup('docs', app, principalDocument, {
    explorer: true,
    swaggerOptions: { urls: swaggerOptionsUrls },
    jsonDocumentUrl: `/docs/swagger.json`,
  });

  config.forEach(el => {
    const documentBuilder = new DocumentBuilder()
      .setTitle(`${title} (${el.name})`)
      .setVersion(el.version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, documentBuilder, { include: el.modules });

    SwaggerModule.setup(el.url, app, document, {
      explorer: true,
      jsonDocumentUrl: `${el.url}/swagger.json`,
    });
  });
};
