import { ZodOpenapi as z } from '../../../lib/extend-zod';

export const CommonSampleSchema = z.object({
  id: z.number().openapi({ description: 'sample id', example: 1 }),
  name: z
    .string()
    .openapi({ description: 'sample name', example: 'this is sample name' }),
  value: z
    .string()
    .openapi({ description: 'sample value', example: 'this is sample value' }),
});
export const CommonSampleParamsSchema = z.object({
  id: z
    .preprocess(Number, z.number())
    .openapi({ description: 'sample id', example: 1 }),
});
