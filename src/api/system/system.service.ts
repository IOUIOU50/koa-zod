import { z } from 'zod';
import { HealthCheckResultSchema } from './zod/heath-check.zod';

export type HealthCheckResult = z.infer<typeof HealthCheckResultSchema>;

export class SystemService {
  checkStatus(): HealthCheckResult {
    return { message: 'healthy' };
  }
}
