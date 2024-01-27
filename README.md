# koa-zod-controller

Expand your API endpoint with

- zod request validation
- generate and serve swagger documentation automatically at once.

this packages is inspired by 'koa-joi-router' and 'koa-zod-router'.

koa-joi-router supports swagger documentation but there's no typescript support.

vice versa, koa-zod-router supports request validation with types declaration(ts support) but there's no swagger documentation

## Quick-use

Plaese read comments. They describe all of concepts in this repository.(5~10m)

```ts
import { Controller, ZodOpenapi as z } from '<PATH>/lib/controller';

const sampleController = new Controller({
  prefix: '/api/v1/samples', // you can set path prefix
  apiTag: 'sample', // swagger tag
});

sampleController
  // usage #1 : .route()
  // when using `.route({ ... })`, you can handle request pure koa's way
  // 1. request validation : O
  // 2. swagger support : O
  // 3. response validation : X
  .route({
    spec: {
      // 'spec' - for both swagger documentation and endpoint configuration simultaneously

      /* required */
      method: 'post',
      path: '/route',
      /* required */

      /* optional */
      summary: 'create a single sample',
      description: 'create a single sample from request data',
      /* optional */
    },
    request: {
      body: z.object({
        name: z.string().openapi({
          description: 'sample name',
          example: 'this is sample name',
        }),
        value: z.string().openapi({
          description: 'sample value',
          example: 'this is sample value',
        }),
      }),
    },
    response: {
      // notice - when if you decided to use '.route()', 'response' is only for swagger generation
      status: 201,
      description: 'sample created',
      schema: z.object({
        id: z.number().openapi({
          description: 'sample id',
          example: 1,
        }),
        name: z.string().openapi({
          description: 'sample name',
          example: 'this is sample name',
        }),
        value: z.string().openapi({
          description: 'sample value',
          example: 'this is sample value',
        }),
      }),
    },
    handler: (ctx) => {
      const { name, value } = ctx.data.body; // validated data is in 'ctx.data'

      // as mentioned, '.route()' should response pure koa's way.
      ctx.status = 201;
      ctx.body = { id: 1, name, value };
    },
  })

  .routeJson({
    // usage #2 : .routeJson()
    // when using `.routeJson({ ... })`, you just return matches with 'response.schena' data
    // 1. request validation : O
    // 2. swagger support : O
    // 3. response validation : O
    spec: {
      /* required */
      method: 'post',
      path: '/json',
      /* required */

      /* optional */
      summary: 'create a single sample',
      description: 'create a single sample from request data',
      /* optional */
    },
    request: {
      body: z.object({
        name: z.string().openapi({
          description: 'sample name',
          example: 'this is sample name',
        }),
        value: z.string().openapi({
          description: 'sample value',
          example: 'this is sample value',
        }),
      }),
    },
    response: {
      // notice - '.routeJson()' validate request, swagger generation and also response data validation.
      status: 201,
      description: 'sample created',
      schema: z.object({
        id: z.number().openapi({
          description: 'sample id',
          example: 1,
        }),
        name: z.string().openapi({
          description: 'sample name',
          example: 'this is sample name',
        }),
        value: z.string().openapi({
          description: 'sample value',
          example: 'this is sample value',
        }),
      }),
    },
    handler: (ctx) => {
      const { name, value } = ctx.data.body; // validated data is in 'ctx.data'
      return { id: 1, name, value }; // when using '.routeJson()', you just return data matches with 'response.schema'
    },
  });
```

check [sample controller example](https://github.com/IOUIOU50/koa-zod/tree/sample-prisma).
