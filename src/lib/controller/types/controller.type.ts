import { Context, Middleware } from 'koa';
import { AnyZodObject, ZodType, z } from 'zod';
import { HttpMethod, ValidatedRequest } from './koa-based.type';

export type ControllerConfig = {
  prefix?: string;
  apiTag?: string;
};

export type ContextWithValidation<
  Query extends AnyZodObject | undefined,
  Params extends AnyZodObject | undefined,
  Headers extends AnyZodObject | undefined,
  Body extends ZodType | undefined,
> = Context & {
  data: ValidatedRequest<Query, Params, Headers, Body>;
};

export type KoaNativeRouteConfig<
  Query extends AnyZodObject | undefined,
  Params extends AnyZodObject | undefined,
  Headers extends AnyZodObject | undefined,
  Body extends ZodType | undefined,
> = {
  spec: {
    method: HttpMethod;
    path: string;
    summary?: string;
    description?: string;
    bearer?: boolean;
    tags?: string | string[];
  };
  middlewares?: Middleware[];
  request?: {
    query?: Query;
    params?: Params;
    headers?: Headers;
    body?: Body;
  };
  response: {
    status: number;
    headers?: Record<string, string>;
    schema?: ZodType;
    description?: string;
  };
  handler: (
    ctx: ContextWithValidation<Query, Params, Headers, Body>
  ) => Promise<void> | void;
};

export type HandlerResult<Response extends ZodType | undefined> =
  Response extends ZodType ? z.infer<Response> : void;

export type JsonRouteConfig<
  Query extends AnyZodObject | undefined,
  Params extends AnyZodObject | undefined,
  Headers extends AnyZodObject | undefined,
  Body extends ZodType | undefined,
  Response extends ZodType | undefined,
> = {
  spec: {
    method: HttpMethod;
    path: string;
    summary?: string;
    description?: string;
    bearer?: boolean;
    tags?: string | string[];
  };
  middlewares?: Middleware[];
  request?: {
    query?: Query;
    params?: Params;
    headers?: Headers;
    body?: Body;
  };
  response: {
    status: number;
    headers?: Record<string, string>;
    schema?: Response;
    description?: string;
  };
  handler: (
    ctx: ContextWithValidation<Query, Params, Headers, Body>
  ) => Promise<HandlerResult<Response>> | HandlerResult<Response>;
};
