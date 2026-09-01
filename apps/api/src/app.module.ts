import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { validationSchema } from './config/validation.schema.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    
    // Si el sistema no usa Observe, se puede comentar el siguiente bloque
    ObserveModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        appKey: configService.getOrThrow<string>('OBSERVE_APP_KEY'),
        appSecret: configService.getOrThrow<string>('OBSERVE_APP_SECRET'),
        serviceId: configService.get<string>('OBSERVE_SERVICE_ID', 'api'),
      }),
    }),

    HealthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}