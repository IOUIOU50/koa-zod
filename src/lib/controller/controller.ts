import { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  OpenAPIObjectConfig,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator';
import Router from '@koa/router';
import Koa, { Middleware } from 'koa';
import { koaSwagger } from 'koa2-swagger-ui';
import { AnyZodObject, ZodError, ZodType } from 'zod';
import { InvalidRequestError, InvalidResponseError } from './error';
import {
  ContextWithValidation,
  ControllerConfig,
  JsonRouteConfig,
  KoaNativeRouteConfig,
} from './types/controller.type';

export class Controller {
  private readonly router: Router;
  private readonly routeConfigs: RouteConfig[] = [];
  private readonly controllerConfig: ControllerConfig;

  constructor({ apiTag, prefix = '/' }: ControllerConfig = {}) {
    this.router = new Router();
    this.controllerConfig = { apiTag, prefix };
  }

  static routeControllers(app: Koa, controllers: Controller[]) {
    for (const controller of controllers) {
      app
        .use(controller.router.routes())
        .use(controller.router.allowedMethods());
    }
  }
  static routeSwaggerDocs(
    apiPath: string,
    app: Koa,
    controllers: Controller[],
    swaggerOption: OpenAPIObjectConfig
  ): void {
    const registry = new OpenAPIRegistry();
    for (const controller of controllers) {
      for (const path of controller.routeConfigs) {
        registry.registerPath(path);
      }
    }

    const swaggerDocumentGenerator = new OpenApiGeneratorV3(
      registry.definitions
    );
    const docs = {
      /* docs - info and paths */
      ...swaggerDocumentGenerator.generateDocument(swaggerOption),

      /* set Bearer auth */
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    };

    app.use(
      koaSwagger({
        routePrefix: apiPath, // Swagger UI를 제공할 경로
        swaggerOptions: {
          spec: docs, // 위에서 생성한 Swagger 문서
        },
      })
    );
  }

  route<
    Query extends AnyZodObject | undefined,
    Params extends AnyZodObject | undefined,
    Headers extends AnyZodObject | undefined,
    Body extends ZodType | undefined,
  >(option: KoaNativeRouteConfig<Query, Params, Headers, Body>): this {
    const { method, path } = this.addRouteConfig<Query, Params, Headers, Body>(
      option
    );

    const koaMiddlewares: Middleware[] = [];
    if (option.middlewares) {
      koaMiddlewares.push(...option.middlewares);
    }

    koaMiddlewares.push(async (ctx, next) => {
      try {
        const { query, params, headers } = ctx;
        const { body } = ctx.request;
        const validation: Record<string, unknown> = {};
        if (option.request?.query) {
          validation.query = option.request.query.parse(query);
        }
        if (option.request?.params) {
          validation.params = option.request.params.parse(params);
        }
        if (option.request?.headers) {
          validation.headers = option.request.headers.parse(headers);
        }
        if (option.request?.body) {
          validation.body = option.request.body.parse(body);
        }
        ctx.data = validation;

        await option.handler(
          ctx as ContextWithValidation<Query, Params, Headers, Body>
        );
        await next();
      } catch (error) {
        if (error instanceof ZodError) {
          throw new InvalidRequestError(error);
        }
        throw error;
      }
    });

    this.router[method](
      path.replace(/{/g, ':').replace(/}/g, ''),
      ...koaMiddlewares
    );

    return this;
  }

  routeJson<
    Query extends AnyZodObject | undefined,
    Params extends AnyZodObject | undefined,
    Headers extends AnyZodObject | undefined,
    Body extends ZodType | undefined,
    Response extends ZodType,
  >(option: JsonRouteConfig<Query, Params, Headers, Body, Response>): this {
    const { path, method } = this.addRouteConfig(option);

    const koaMiddlewares: Middleware[] = [];
    if (option.middlewares) {
      koaMiddlewares.push(...option.middlewares);
    }

    koaMiddlewares.push(async (ctx, next) => {
      try {
        const { query, params, headers } = ctx;
        const { body } = ctx.request;
        const validation: Record<string, unknown> = {};
        if (option.request?.query) {
          validation.query = option.request.query.parse(query);
        }
        if (option.request?.params) {
          validation.params = option.request.params.parse(params);
        }
        if (option.request?.headers) {
          validation.headers = option.request.headers.parse(headers);
        }
        if (option.request?.body) {
          validation.body = option.request.body.parse(body);
        }
        ctx.data = validation;

        const result = await option.handler(
          ctx as ContextWithValidation<Query, Params, Headers, Body>
        );

        if (option.response.schema) {
          const responseValidation = option.response.schema.safeParse(result);
          if (!responseValidation.success) {
            throw new InvalidResponseError(responseValidation.error);
          }
          ctx.status = option.response.status;
          ctx.set(option.response.headers ?? {});
          ctx.body = responseValidation.data;
        } else {
          ctx.status = option.response.status;
          ctx.set(option.response.headers ?? {});
          ctx.body = result;
        }
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          throw new InvalidRequestError(error);
        }
        throw error;
      }
    });

    this.router[method](
      path.replace(/{/g, ':').replace(/}/g, ''),
      ...koaMiddlewares
    );

    return this;
  }

  private addRouteConfig<
    Query extends AnyZodObject | undefined,
    Params extends AnyZodObject | undefined,
    Headers extends AnyZodObject | undefined,
    Body extends ZodType | undefined,
  >(option: KoaNativeRouteConfig<Query, Params, Headers, Body>) {
    const path =
      this.controllerConfig?.prefix + option.spec.path.replace(/\/$/, ''); // 마지막 슬래시 제거
    const method = option.spec.method;
    const routeConfig: RouteConfig = {
      method,
      path,
      responses: {
        [option.response.status]: {
          description: option.response.description ?? '',
        },
      },
    };
    if (option.spec.summary) {
      routeConfig.summary = option.spec.summary;
    }
    if (option.spec.description) {
      routeConfig.description = option.spec.description;
    }
    if (option.spec.bearer) {
      routeConfig.security = [
        {
          bearerAuth: [],
        },
      ];
    }
    if (this.controllerConfig?.apiTag) {
      routeConfig.tags = Array.isArray(this.controllerConfig.apiTag)
        ? this.controllerConfig.apiTag
        : [this.controllerConfig.apiTag];
    }
    if (option.spec.tags) {
      routeConfig.tags = Array.isArray(option.spec.tags)
        ? option.spec.tags
        : [option.spec.tags];
    }
    if (option.request) {
      routeConfig.request = {};
      if (option.request.headers) {
        routeConfig.request.headers = option.request.headers;
      }
      if (option.request.params) {
        routeConfig.request.params = option.request.params;
      }
      if (option.request.query) {
        routeConfig.request.query = option.request.query;
      }
      if (option.request.body) {
        routeConfig.request.body = {
          content: {
            'application/json': {
              schema: option.request.body,
            },
          },
        };
      }
    }

    if (option.response.schema) {
      routeConfig.responses[option.response.status].content = {
        'application/json': { schema: option.response.schema },
      };
    }
    this.routeConfigs.push(routeConfig);
    return { method, path };
  }
}
