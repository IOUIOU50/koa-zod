import { Controller } from '../../lib/controller';
import { SystemService } from './system.service';
import { HealthCheckResultSchema } from './zod/heath-check.zod';

const systemService = new SystemService();
export const systemController = new Controller({
  prefix: '/api/v1/systems',
  apiTag: 'system',
}).routeJson({
  spec: {
    method: 'get',
    path: '/',
    summary: 'health check',
  },
  response: {
    status: 200,
    description: 'system available',
    schema: HealthCheckResultSchema,
  },
  handler: () => systemService.checkStatus(),
});
