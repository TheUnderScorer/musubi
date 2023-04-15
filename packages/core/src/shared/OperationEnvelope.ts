import { serializeContext } from './serializeContext';
import { EnvelopeContext, EnvelopeContextEntry } from './context';

export abstract class OperationEnvelope<Ctx> {
  private readonly internalCtx?: EnvelopeContext<Ctx>;

  protected constructor(ctx?: Ctx) {
    this.internalCtx = ctx
      ? OperationEnvelope.toContext(ctx)
      : ({} as EnvelopeContext<Ctx>);
  }

  get ctx() {
    return this.internalCtx
      ? Object.entries(this.internalCtx).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: (value as EnvelopeContextEntry<unknown>).value,
          };
        }, {} as Ctx)
      : ({} as Ctx);
  }

  private static toContext<V extends object>(values: V) {
    return Object.entries(values).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: {
          value,
          isSerializable: typeof value !== 'function',
        },
      };
    }, {} as EnvelopeContext<V>);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCtx<Values extends object>(values: EnvelopeContext<Values>) {
    Object.assign(this, {
      internalCtx: {
        ...this.internalCtx,
        ...values,
      },
    });

    return this as this & OperationEnvelope<Ctx & Values>;
  }

  toJSON() {
    return {
      ...this,
      ctx: serializeContext(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.internalCtx as Record<string, EnvelopeContextEntry<any>>
      ),
    };
  }
}