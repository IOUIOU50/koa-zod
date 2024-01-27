import { Controller } from '../../lib/controller';
import { SampleService } from './sample.service';
import {
  CommonSampleParamsSchema,
  CommonSampleSchema,
} from './zod/common-sample.zod';
import { CreateSampleBodySchema } from './zod/create-sample.zod';
import {
  FindAllSamplesQuerySchema,
  FindAllSamplesResultSchema,
} from './zod/find-samples-all.zod';
import { UpdateSampleBodySchema } from './zod/update-sample.zod';

const sampleService = new SampleService();
export const SampleController = new Controller({
  prefix: '/api/v1/samples',
  apiTag: 'sample',
})
  .routeJson({
    spec: {
      method: 'post',
      path: '/',
      summary: 'create sample',
    },
    request: {
      body: CreateSampleBodySchema,
    },
    response: {
      status: 200,
      description: 'sample created',
      schema: CommonSampleSchema,
    },
    handler: async (ctx) => await sampleService.create(ctx.data.body),
  })
  .routeJson({
    spec: {
      method: 'get',
      path: '/',
      summary: 'find and get samples all',
    },
    request: {
      query: FindAllSamplesQuerySchema,
    },
    response: {
      status: 200,
      description: 'found samples all',
      schema: FindAllSamplesResultSchema,
    },
    handler: async (ctx) => await sampleService.findAll(ctx.data.query),
  })
  .routeJson({
    spec: {
      method: 'get',
      path: '/{id}',
      summary: 'find and get a single sample',
    },
    request: {
      params: CommonSampleParamsSchema,
    },
    response: {
      status: 200,
      description: 'found a single sample',
      schema: CommonSampleSchema,
    },
    handler: async (ctx) => await sampleService.findOne(ctx.data.params.id),
  })
  .routeJson({
    spec: {
      method: 'patch',
      path: '/{id}',
      summary: 'update a single sample',
    },
    request: {
      params: CommonSampleParamsSchema,
      body: UpdateSampleBodySchema,
    },
    response: {
      status: 200,
      description: 'update a single sample',
      schema: CommonSampleSchema,
    },
    handler: async (ctx) =>
      await sampleService.update(ctx.data.params.id, ctx.data.body),
  })
  .routeJson({
    spec: {
      method: 'delete',
      path: '/{id}',
      summary: 'delete a single sample',
    },
    request: {
      params: CommonSampleParamsSchema,
    },
    response: {
      status: 204,
      description: 'delete a single sample',
    },
    handler: async (ctx) => await sampleService.delete(ctx.data.params.id),
  });
