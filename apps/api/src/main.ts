import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { setupSwagger } from './docs/swagger.js';
import * as express from 'express/index.js';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      // Si el sistema no usa Observe, se puede comentar la siguiente línea
      instrument: ObserveInstrument,
    }
  );

  app.setGlobalPrefix('/api', { exclude: ['docs', 'docs-json'] });

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableShutdownHooks();

  // Register raw body parser for Clerk webhook signature verification
  app.use('/api/webhooks/clerk', express.raw({ type: 'application/json' }));

  if (configService.get<string>('NODE_ENV', 'production') === 'development') {
    setupSwagger(app);
  }

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  Logger.log(`Application listening on port ${port}`, 'Bootstrap');
}
await bootstrap();
