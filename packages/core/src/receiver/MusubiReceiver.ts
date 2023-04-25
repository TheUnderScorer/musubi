import {
  ExtractPayload,
  OperationKind,
  OperationName,
  OperationsSchema,
} from '../schema/schema.types';
import { OperationHandler, ReceiverLink } from './receiver.types';
import { OperationResponse } from '../shared/OperationResponse';
import { RootReceiverLink } from './RootReceiverLink';
import { filter } from 'rxjs';
import { Channel } from '../shared/communication.types';
import { validatePayload, validateResult } from '../schema/validation';
import { OperationRequest } from '../shared/OperationRequest';
import { MaybePromise } from '../shared/promise';
import { LinkParam } from '../shared/link.types';
import { createLinks } from '../shared/link';
import { OperationReceiverBuilder } from './OperationReceiverBuilder';
import { OperationDefinition } from '../schema/OperationDefinition';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MusubiReceiver<S extends OperationsSchema, Ctx = any> {
  private readonly rootLink: RootReceiverLink<Ctx>;

  constructor(
    private readonly schema: S,
    links: LinkParam<ReceiverLink<Ctx>>[]
  ) {
    this.rootLink = new RootReceiverLink(createLinks(links, schema));
  }

  handleQuery<Name extends keyof S['queries']>(
    name: Name,
    handler: OperationHandler<S['queries'][Name], Ctx>
  ) {
    return this.handleOperation(
      name as OperationName,
      handler,
      OperationKind.Query
    );
  }

  handleCommand<Name extends keyof S['commands']>(
    name: Name,
    handler: OperationHandler<S['commands'][Name], Ctx>
  ) {
    return this.handleOperation(
      name as OperationName,
      handler,
      OperationKind.Command
    );
  }

  async dispatchEvent<Name extends keyof S['events']>(
    name: Name,
    payload?: ExtractPayload<S['events'][Name]>,
    channel?: Channel
  ) {
    const response = new OperationResponse<
      typeof payload,
      OperationRequest<unknown, Ctx>
    >(
      name as OperationName,
      OperationKind.Event,
      null,
      validatePayload(
        this.schema,
        OperationKind.Event,
        name as OperationName,
        payload
      ),
      null,
      channel
    );

    await this.rootLink.sendResponse(response);
  }

  handleQueryBuilder<Key extends keyof S['queries'], OpCtx>(name: Key) {
    const definition = this.schema.queries[name as OperationName];

    return this.createBuilder<typeof definition, OpCtx>(definition);
  }

  handleCommandBuilder<Key extends keyof S['commands'], OpCtx>(name: Key) {
    const definition = this.schema.commands[name as OperationName];

    return this.createBuilder<typeof definition, OpCtx>(definition);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createBuilder<Operation extends OperationDefinition<any>, OpCtx>(
    operation: Operation
  ): OperationReceiverBuilder<Operation, Ctx & OpCtx> {
    return new OperationReceiverBuilder<Operation, Ctx & OpCtx>(
      this as MusubiReceiver<S, Ctx & OpCtx>,
      operation
    );
  }

  private handleOperation<Payload, Result>(
    name: OperationName,
    handler: (payload: Payload, ctx: Ctx) => MaybePromise<Result>,
    kind: OperationKind
  ) {
    return this.rootLink
      .observeNewRequest(name)
      .pipe(filter((req) => req.kind === kind))
      .subscribe(async (request) => {
        let response: OperationResponse<Result, OperationRequest<Payload, Ctx>>;

        try {
          const payload = validatePayload(
            this.schema,
            kind,
            name,
            request.payload as Payload
          );
          const ctx = {
            ...(request.ctx as Ctx),
          };
          const result = await handler(payload, ctx);

          if (typeof ctx === 'object') {
            Object.keys(ctx as object).forEach((key) => {
              request.addCtx({
                [key]: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value: (ctx as any)[key],
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  isSerializable: request.isCtxSerializable(key as any),
                },
              });
            });
          }

          response = OperationResponse.fromResult<
            Result,
            OperationRequest<Payload, Ctx>
          >(
            request.name,
            request.kind,
            validateResult(this.schema, kind, name, result),
            request as OperationRequest<Payload, Ctx>
          );
        } catch (error) {
          response = OperationResponse.fromError<
            Result,
            OperationRequest<Payload, Ctx>
          >(
            request.name,
            request.kind,
            error,
            request as OperationRequest<Payload, Ctx>
          );
        }

        await this.rootLink.sendResponse(response);
      });
  }
}
