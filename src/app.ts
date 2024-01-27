import Koa from 'koa';
import BodyParser from 'koa-bodyparser';
import Pino from 'koa-pino-logger';
import { controllers } from './api';
import { Controller } from './lib/controller';
import { errorHandler } from './lib/middlewares/error-handler';

const app = new Koa();

app.use(BodyParser());
app.use(Pino());
app.use(errorHandler);

Controller.routeControllers(app, controllers);
Controller.routeSwaggerDocs('/docs', app, controllers, {
  openapi: '3.0.0',
  info: {
    title: 'sample server',
    version: '0.0.0',
  },
});

export { app };
