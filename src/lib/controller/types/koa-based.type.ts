import { IncomingHttpHeaders } from 'http';
import type { AnyZodObject, ZodType, z } from 'zod';

export type ValidatedRequest<
  Query extends AnyZodObject | undefined,
  Params extends AnyZodObject | undefined,
  Headers extends AnyZodObject | undefined,
  Body extends ZodType | undefined,
> = (Query extends AnyZodObject ? { query: z.infer<Query> } : object) &
  (Params extends AnyZodObject ? { params: z.infer<Params> } : object) &
  (Headers extends AnyZodObject
    ? { headers: IncomingHttpHeaders & z.infer<Headers> }
    : object) &
  (Body extends ZodType ? { body: z.infer<Body> } : object);

export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'head'
  | 'options';
