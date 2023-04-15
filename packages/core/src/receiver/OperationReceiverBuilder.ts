/* eslint-disable @typescript-eslint/no-explicit-any */
import { MaybePromise } from '../shared/promise';
import { OperationHandler } from './receiver.types';
import { OperationDefinition } from '../schema/OperationDefinition';
import {
  ExtractPayload,
  ExtractResult,
  OperationKind,
} from '../schema/schema.types';
import { MusubiReceiver } from './MusubiReceiver';

export interface OperationBeforeMiddlewareParams<
  Operation extends OperationDefinition<OperationKind>,
  Payload,
  Ctx
> {
  operation: Operation;
  payload: Payload;
  ctx: Ctx;
}

export interface OperationAfterMiddlewareParams<
  Operation extends OperationDefinition<OperationKind>,
  Payload,
  Ctx,
  Result
> extends OperationBeforeMiddlewareParams<Operation, Payload, Ctx> {
  data: OperationAfterResult<Result>;
}

export type OperationBeforeMiddleware<
  Operation extends OperationDefinition<OperationKind>,
  Ctx,
  Result
> = (
  params: OperationBeforeMiddlewareParams<
    Operation,
    ExtractPayload<Operation>,
    Ctx
  >
) => MaybePromise<Result>;

export type OperationAfterResult<Result> =
  | { error: Error; result: null }
  | { error: null; result: Result };

export type OperationAfterMiddleware<
  Operation extends OperationDefinition<OperationKind>,
  Ctx
> = (
  params: OperationAfterMiddlewareParams<
    Operation,
    ExtractPayload<Operation>,
    Ctx,
    ExtractResult<Operation>
  >
) => MaybePromise<void>;

export class OperationReceiverBuilder<
  Operation extends OperationDefinition<any>,
  Ctx
> {
  private rootHandler?: OperationHandler<Operation, Ctx>;

  private readonly middlewareBefore: OperationBeforeMiddleware<
    Operation,
    Ctx,
    unknown
  >[] = [];

  private readonly middlewareAfter: OperationAfterMiddleware<Operation, Ctx>[] =
    [];

  constructor(
    private readonly receiver: MusubiReceiver<any, Ctx>,
    private readonly operation: Operation
  ) {}

  withHandler(handler: OperationHandler<Operation, Ctx>) {
    this.rootHandler = handler;

    return this;
  }

  /**
   * Appends middleware to be executed before operation handler.
   * */
  runBefore<MiddlewareReturn>(
    middleware: OperationBeforeMiddleware<Operation, Ctx, MiddlewareReturn>
  ) {
    this.middlewareBefore.push(middleware);

    return this as unknown as OperationReceiverBuilder<
      Operation,
      MiddlewareReturn extends Awaited<infer V>
        ? V extends void | undefined | null
          ? Ctx
          : MiddlewareReturn
        : Ctx
    >;
  }

  /**
   * Appends middleware to be executed after operation handler.
   * */
  runAfter(middleware: OperationAfterMiddleware<Operation, Ctx>) {
    this.middlewareAfter.push(middleware);

    return this as unknown as OperationReceiverBuilder<Operation, Ctx>;
  }

  /**
   * Builds operation handler that can be passed into receiver.
   * @see register
   * */
  toHandler(): OperationHandler<Operation, Ctx> {
    if (!this.rootHandler) {
      throw new Error(
        'Root handler is missing. Perhaps you forgot to call .withHandler() ?'
      );
    }

    return async (payload, ctx) => {
      const rootCtx = {
        ...ctx,
      };

      for (const middleware of this.middlewareBefore) {
        const result = await middleware({
          operation: this.operation,
          ctx: rootCtx,
          payload,
        });

        if (result) {
          Object.assign(rootCtx as object, {
            ...rootCtx,
            ...result,
          });
        }
      }

      const asyncHandler = async () => this.rootHandler?.(payload, rootCtx);

      const result = await asyncHandler().catch((error) => error);
      const isError = result instanceof Error;

      for (const middleware of this.middlewareAfter) {
        await middleware({
          operation: this.operation,
          payload,
          ctx: rootCtx,
          data: {
            error: isError ? result : null,
            result,
          } as OperationAfterResult<Awaited<ExtractResult<Operation>>>,
        });
      }

      if (isError) {
        throw result;
      }

      return result;
    };
  }

  /**
   * Registers handler into receiver
   * */
  register() {
    const handler = this.toHandler();

    switch (this.operation.kind) {
      case OperationKind.Command:
        return this.receiver.handleCommand(this.operation.name, handler);

      case OperationKind.Query:
        return this.receiver.handleQuery(this.operation.name, handler);

      default:
        throw new Error(`Unknown operation kind: ${this.operation.kind}`);
    }
  }
}
