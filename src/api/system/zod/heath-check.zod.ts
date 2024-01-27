import { ZodOpenapi as z } from '../../../lib/extend-zod';

export const HealthCheckResultSchema = z.object({
  message: z
    .string()
    .openapi({ description: 'status message', example: 'healthy' }),
});
