/* eslint-disable @typescript-eslint/no-explicit-any */
import { OperationKind, OperationName } from './schema.types';
import { ZodSchema } from 'zod';

export class OperationDefinition<
  Kind extends OperationKind,
  Name extends OperationName = OperationName,
  Payload = undefined,
  Result = any,
  Meta = any
> {
  payload!: Payload;

  result!: Result;

  name!: Name;

  meta!: Meta;

  constructor(public kind: OperationKind) {}

  static query() {
    return new OperationDefinition<OperationKind.Query>(OperationKind.Query);
  }

  static command() {
    return new OperationDefinition<OperationKind.Command>(
      OperationKind.Command
    );
  }

  static event() {
    return new OperationDefinition<OperationKind.Event>(OperationKind.Event);
  }

  withPayload<P>(): OperationDefinition<Kind, Name, P, Result>;
  withPayload<P extends ZodSchema>(
    zod: P
  ): OperationDefinition<Kind, Name, P, Result>;
  withPayload<P extends ZodSchema>(zodSchema?: P) {
    if (zodSchema) {
      Object.assign(this, {
        payload: zodSchema,
      });
    }

    return this as unknown as OperationDefinition<Kind, Name, P, Result>;
  }

  withName<N extends OperationName>(name: N) {
    Object.assign(this, {
      name,
    });

    return this as unknown as OperationDefinition<Kind, N, Payload, Result>;
  }

  withResult<R>(): OperationDefinition<Kind, Name, Payload, R>;
  withResult<R>(zod: ZodSchema<R>): OperationDefinition<Kind, Name, Payload, R>;
  withResult<R extends ZodSchema>(zodSchema?: R) {
    if (this.kind === OperationKind.Event) {
      throw new TypeError('Events cannot have a result');
    }

    if (zodSchema) {
      Object.assign(this, {
        result: zodSchema,
      });
    }

    return this as unknown as OperationDefinition<Kind, Name, Payload, R>;
  }

  withMeta<M extends object>(meta: M | ((definition: this) => M)) {
    Object.assign(this, {
      meta: {
        ...this.meta,
        ...(typeof meta === 'function' ? meta(this) : meta),
      },
    });

    return this as unknown as OperationDefinition<
      Kind,
      Name,
      Payload,
      Result,
      Meta & M
    >;
  }

  toDefinition() {
    return {
      name: this.name,
      kind: this.kind,
      payload: this.payload as Payload,
      result: this.result as Result,
      meta: this.meta as Meta,
    } as OperationDefinition<Kind, Name, Payload, Result, Meta>;
  }
}
