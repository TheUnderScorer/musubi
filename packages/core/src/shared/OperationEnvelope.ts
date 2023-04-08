import { serializeContext } from './serializeContext';

export abstract class OperationEnvelope<Ctx> {
  protected constructor(public ctx?: Ctx) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCtx<T extends Record<string, any>>(values: T) {
    Object.assign(this, {
      ctx: {
        ...this.ctx,
        ...values,
      },
    });

    return this as this & OperationEnvelope<Ctx & T>;
  }

  toJSON() {
    return {
      ...this,
      ctx: serializeContext(this.ctx),
    };
  }
}
