# koa-zod-controller

Expand your API endpoint with

- zod request validation
- generate and serve swagger documentation automatically at once.

this packages is inspired by 'koa-joi-router' and 'koa-zod-router'.

koa-joi-router supports swagger documentation but there's no typescript support.

vice versa, koa-zod-router supports request validation with types declaration(ts support) but there's no swagger documentation

## Quick-use

```ts
import { Controller, ZodOpenapi as z } from 'koa-zod-controller';

const sampleController = new Controller({
  prefix: '/api/v1/samples', // you can set path prefix
  apiTag: 'sample', // swagger tag
});

// usage #1 : .route()
// when using `.route({ ... })`, you can handle request pure koa's way
// but request data is validated and type declared by using 'zod'
sampleController.route({
  spec: {
    // 'spec' - for both swagger documentation and endpoint configuration simultaneously

    /* required */
    method: 'get',
    path: '/',
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
  response,
  handler, // notice : handler must return 'Promise<T>'
});
```
