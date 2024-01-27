import { Context, Next } from 'koa';
import { InvalidRequestError, InvalidResponseError } from '../controller';
import { CommonError } from '../errors';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    let commonError: CommonError;
    if (error instanceof CommonError) {
      commonError = error;
    } else if (error instanceof InvalidRequestError) {
      commonError = new CommonError(400, 'invalid request', error.zodError);
    } else if (error instanceof InvalidResponseError) {
      commonError = new CommonError(
        500,
        'internal server error: invalid response',
        error.zodError
      );
    } else {
      commonError = new CommonError(500, 'unknown error', error);
    }

    const { status, message, detail } = commonError;
    const body: { status: number; message: string; detail?: unknown } = {
      status,
      message,
    };
    if (status >= 500) {
      ctx.log.error(error);
    } else {
      body.detail = detail;
    }
    ctx.status = status;
    ctx.body = body;
  }
};
