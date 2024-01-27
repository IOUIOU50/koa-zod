import { ZodError } from 'zod';

export class InvalidRequestError extends Error {
  constructor(public readonly zodError: ZodError) {
    super('invalid request');
  }
}

export class InvalidResponseError extends Error {
  constructor(public readonly zodError: ZodError) {
    super('invalid response');
  }
}
