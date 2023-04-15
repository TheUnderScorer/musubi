/* eslint-disable @typescript-eslint/no-explicit-any */
import { MaybePromise } from '../shared/promise';
import { ReadonlyDeep } from 'type-fest';
import { OperationHandler } from './receiver.types';
import { OperationDefinition } from '../schema/OperationDefinition';
import {
  ExtractPayload,
  ExtractResult,
  OperationKind,
  OperationName,
} from '../schema/schema.types';
import { MusubiReceiver } from './MusubiReceiver';

export type OperationBeforeMiddleware<Payload, Ctx, Result> = (
  name: OperationName,
  payload: Payload,
  ctx: Ctx
) => MaybePromise<Result>;

export type OperationAfterResult<Result> =
  | { error: Error; result: null }
  | { error: null; result: Result };

export type OperationAfterMiddleware<Payload, OperationResult, Ctx> = (
  name: OperationName,
  payload: ReadonlyDeep<Payload>,
  ctx: Ctx,
  data: OperationAfterResult<Awaited<OperationResult>>
) => MaybePromise<void>;

export class OperationReceiverBuilder<
  Operation extends OperationDefinition<any>,
  Ctx
> {
  private rootHandler?: OperationHandler<Operation, Ctx>;

  private readonly middlewareBefore: OperationBeforeMiddleware<
    ExtractPayload<Operation>,
    Ctx,
    unknown
  >[] = [];

  private readonly middlewareAfter: OperationAfterMiddleware<
    ExtractPayload<Operation>,
    ExtractResult<Operation>,
    Ctx
  >[] = [];

  constructor(
    private readonly receiver: MusubiReceiver<any, Ctx>,
    private readonly name: OperationName,
    private readonly kind: OperationKind
  ) {}

  withHandler(handler: OperationHandler<Operation, Ctx>) {
    this.rootHandler = handler;

    return this;
  }

  /**
   * Appends middleware to be executed before operation handler.
   * */
  runBefore<MiddlewareReturn>(
    middleware: OperationBeforeMiddleware<
      ExtractPayload<Operation>,
      Ctx,
      MiddlewareReturn
    >
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
  runAfter(
    middleware: OperationAfterMiddleware<
      ExtractPayload<Operation>,
      ExtractResult<Operation>,
      Ctx
    >
  ) {
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
        const result = await middleware(this.name, payload, {
          ...rootCtx,
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
        await middleware(
          this.name,
          payload as ReadonlyDeep<ExtractPayload<Operation>>,
          rootCtx,
          {
            error: isError ? result : null,
            result,
          } as OperationAfterResult<Awaited<ExtractResult<Operation>>>
        );
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

    switch (this.kind) {
      case OperationKind.Command:
        return this.receiver.handleCommand(this.name, handler);

      case OperationKind.Query:
        return this.receiver.handleQuery(this.name, handler);

      default:
        throw new Error(`Unknown operation kind: ${this.kind}`);
    }
  }
}
