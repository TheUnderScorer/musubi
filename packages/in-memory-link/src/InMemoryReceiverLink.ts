import {
  Observable,
  OperationKind,
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { Handlers } from './handlers';

export class InMemoryReceiverLink<Ctx = unknown> implements ReceiverLink<Ctx> {
  constructor(readonly handlers: Handlers) {}

  async sendResponse<Payload, Result>(
    response: OperationResponse<Result, OperationRequest<Payload, Ctx>>
  ) {
    if (response.operationKind === OperationKind.Event) {
      await this.handlers.event.next(response);
    } else {
      await this.handlers.operationResult.next(response);
    }
  }

  receiveRequest(name: OperationName) {
    return this.handlers.operation.filter(
      (req) => req.name === name
    ) as Observable<OperationRequest<unknown, Ctx>>;
  }
}
