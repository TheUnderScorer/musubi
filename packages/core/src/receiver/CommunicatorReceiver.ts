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

export class CommunicatorReceiver<S extends OperationsSchema, Ctx = unknown> {
  private readonly rootLink: RootReceiverLink<Ctx>;

  constructor(private readonly schema: S, links: ReceiverLink<Ctx>[]) {
    this.rootLink = new RootReceiverLink(links);
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
    payload: ExtractPayload<S['events'][Name]>,
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

  private handleOperation<Payload, Result>(
    name: OperationName,
    handler: (payload: Payload, ctx: Ctx) => Promise<Result>,
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
          const result = await handler(payload, request.ctx as Ctx);

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
