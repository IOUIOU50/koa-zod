export class CommonError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly detail?: unknown
  ) {
    super(message);
  }
}
