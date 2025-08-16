export default class L2SError extends Error {
  constructor(message: string, inner?: Error) {
    super(message);
    this.name = "Lookup2Select Error";
    if (inner) (this as any).cause = inner;
    if (inner?.stack) this.stack = inner.stack;
  }
}
