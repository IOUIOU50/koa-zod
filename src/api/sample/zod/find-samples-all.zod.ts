import { ZodOpenapi as z } from '../../../lib/extend-zod';
import { CommonSampleSchema } from './common-sample.zod';

export const FindAllSamplesQuerySchema = z
  .object({
    sort: z
      .enum(['id', 'name', 'value'])
      .optional()
      .default('id')
      .openapi({ description: 'set sort by' }),
    order: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc')
      .openapi({ description: 'set order by' }),
    page: z
      .preprocess(Number, z.number()) // query is treated as string
      .optional()
      .default(1)
      .openapi({ description: 'pagination - page' }),
    size: z
      .preprocess(Number, z.number()) // query is treated as string
      .optional()
      .default(10)
      .openapi({ description: 'pagination - page' }),
  })
  .merge(CommonSampleSchema.pick({ name: true, value: true }).partial()); // use zod utilities as much as possible
export const FindAllSamplesResultSchema = z.object({
  total: z.number().openapi({
    description: 'total entities matches with query for pagination',
    example: 100,
  }),
  samples: z.array(CommonSampleSchema),
});
