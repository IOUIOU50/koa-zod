import { Controller } from '../lib/controller';
import { ZodOpenapi as z } from '../lib/extend-zod';

export const SampleController = new Controller({
  prefix: '/api/v1/samples',
  apiTag: 'sample',
}).routeJson({
  spec: {
    method: 'post',
    path: '/',
    summary: 'create sample',
  },
  request: {
    body: z.object({
      name: z.string().openapi({
        description: 'this is sample name',
        example: 'sample name',
      }),
      value: z.string().openapi({
        description: 'this is sample value',
        example: 'sample value',
      }),
      additional: z.string().openapi({
        description: 'this is additional field',
        example: 'additional',
      }),
    }),
  },
  response: {
    status: 200,
    description: 'sample created',
    schema: z.object({
      id: z.number().openapi({ description: 'sample id', example: 1 }),
      name: z.string().openapi({
        description: 'this is sample name',
        example: 'sample name',
      }),
      value: z.string().openapi({
        description: 'this is sample value',
        example: 'sample value',
      }),
      additional: z.string().openapi({
        description: 'this is additional field',
        example: 'additional',
      }),
    }),
  },
  handler: (ctx) => {
    const id = Math.floor(Math.random() * 10);
    const { name, value, additional } = ctx.data.body;
    return { id, name, value, additional };
  },
});
