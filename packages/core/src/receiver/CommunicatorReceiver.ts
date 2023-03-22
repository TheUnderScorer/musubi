import {
  ExtractPayload,
  OperationKind,
  OperationName,
} from '../schema/schema.types';
import { OperationHandler, ReceiverLink } from './receiver.types';
import { OperationResponse } from '../shared/OperationResponse';
import { RootReceiverLink } from './RootReceiverLink';
import { OperationsSchema } from '../schema/OperationsSchema';

export class CommunicatorReceiver<S extends OperationsSchema> {
  private readonly rootLink: RootReceiverLink;

  constructor(private readonly schema: S, links: ReceiverLink[]) {
    this.rootLink = new RootReceiverLink(links);
  }

  handleQuery<Name extends keyof S['queries']>(
    name: Name,
    handler: OperationHandler<S['queries'][Name]>
  ) {
    return this.handleOperation(
      name as OperationName,
      handler,
      OperationKind.Query
    );
  }

  handleCommand<Name extends keyof S['commands']>(
    name: Name,
    handler: OperationHandler<S['commands'][Name]>
  ) {
    return this.handleOperation(
      name as OperationName,
      handler,
      OperationKind.Command
    );
  }

  async dispatchEvent<Name extends keyof S['events']>(
    name: Name,
    payload: ExtractPayload<S['events'][Name]>
  ) {
    const response = new OperationResponse(
      name as OperationName,
      OperationKind.Event,
      null,
      payload,
      null
    );

    await this.rootLink.sendResponse(response);
  }

  private handleOperation<Payload, Result>(
    name: OperationName,
    handler: (payload: Payload) => Promise<Result>,
    kind: OperationKind
  ) {
    return this.rootLink.newRequest.subscribe(async (request) => {
      if (request.name === name && request.kind === kind) {
        let response: OperationResponse;

        try {
          // TODO Validate payload
          const result = await handler(request.payload as Payload);

          response = OperationResponse.fromResult(
            request.name,
            request.kind,
            result,
            request
          );
        } catch (error) {
          response = OperationResponse.fromError(
            request.name,
            request.kind,
            error,
            request
          );
        }

        // TODO Validate result
        await this.rootLink.sendResponse(response);
      }
    });
  }
}
