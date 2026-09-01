import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function setupSwagger(app: INestApplication): void {
  const openApiConfig = new DocumentBuilder()
    .setTitle('InexApp API')
    .setDescription('API documentation for the InexApp system')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Pega solo el access token, sin prefijo Bearer.',
    })
    .build();

  const openApiDocument = SwaggerModule.createDocument(app, openApiConfig);

  SwaggerModule.setup('docs', app, openApiDocument, {
    ui: false,
    jsonDocumentUrl: '/openapi.json',
  });

  app.use(
    '/reference',
    apiReference({
      url: '/openapi.json',
      theme: 'default',
    }),
  );
}
