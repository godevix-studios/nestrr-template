import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { HealthCheckResult } from './health.service.js';
import { HealthService } from './health.service.js';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({
    description: 'Application is healthy',
    schema: { example: { status: 'ok' } },
  })
  check(): HealthCheckResult {
    return this.healthService.check();
  }
}
