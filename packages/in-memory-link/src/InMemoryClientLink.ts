import { Handlers } from './handlers';
import { ClientLink, OperationRequest, OperationResponse } from '@musubi/core';
import { filter, Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class InMemoryClientLink<Ctx = any> implements ClientLink<Ctx> {
  constructor(readonly handlers: Handlers) {}

  subscribeToEvent<Payload>(request: OperationRequest<Payload, Ctx>) {
    return this.handlers.event.pipe(
      filter((event) => event.operationName === request.name)
    ) as Observable<OperationResponse<Payload, OperationRequest<unknown, Ctx>>>;
  }

  sendRequest<Payload, Result>(
    request: OperationRequest<Payload, Ctx>
  ): Promise<OperationResponse<Result, OperationRequest<Payload, Ctx>>> {
    return new Promise((resolve) => {
      const subscription = this.handlers.operationResult.subscribe(
        (response) => {
          if (response.request?.id === request.id) {
            subscription.unsubscribe();
            resolve(
              response as OperationResponse<
                Result,
                OperationRequest<Payload, Ctx>
              >
            );
          }
        }
      );

      this.handlers.operation.next(request);
    });
  }
}
