import {
  OperationKind,
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { Handlers } from './handlers';
import { filter, Observable } from 'rxjs';

export class InMemoryReceiverLink<Ctx = unknown> implements ReceiverLink<Ctx> {
  constructor(readonly handlers: Handlers) {}

  async sendResponse<Payload, Result>(
    response: OperationResponse<Result, OperationRequest<Payload, Ctx>>
  ) {
    if (response.operationKind === OperationKind.Event) {
      this.handlers.event.next(response);
    } else {
      this.handlers.operationResult.next(response);
    }
  }

  receiveRequest(name: OperationName) {
    return this.handlers.operation.pipe(
      filter((req) => req.name === name)
    ) as Observable<OperationRequest<unknown, Ctx>>;
  }
}
