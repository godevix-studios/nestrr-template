import { Injectable } from '@nestjs/common';

export type HealthCheckResult = { status: 'ok' };

@Injectable()
export class HealthService {
  check(): HealthCheckResult {
    return { status: 'ok' };
  }
}
