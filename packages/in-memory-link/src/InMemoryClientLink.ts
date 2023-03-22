import { Handlers } from './handlers';
import { ClientLink, OperationRequest, OperationResponse } from '@musubi/core';
import { filter, Observable } from 'rxjs';

export class InMemoryClientLink<Ctx = unknown> implements ClientLink<Ctx> {
  constructor(private readonly handlers: Handlers) {}

  subscribeToEvent<Payload, Result>(request: OperationRequest<Payload, Ctx>) {
    return this.handlers.event.pipe(
      filter((event) => event.operationName === request.name)
    ) as Observable<OperationResponse<Result, OperationRequest<Payload, Ctx>>>;
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
