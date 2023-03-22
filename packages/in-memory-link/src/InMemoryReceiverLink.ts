import {
  OperationKind,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { Handlers } from './handlers';
import { Observable } from 'rxjs';

export class InMemoryReceiverLink<Ctx = unknown> implements ReceiverLink<Ctx> {
  constructor(private readonly handlers: Handlers) {}

  async sendEventToClient<Result>(event: OperationResponse<Result>) {
    this.handlers.event.next(event);
  }

  async sendResponse<Payload, Result>(
    response: OperationResponse<Result, OperationRequest<Payload, Ctx>>
  ) {
    if (response.operationKind === OperationKind.Event) {
      this.handlers.event.next(response);
    } else {
      this.handlers.operationResult.next(response);
    }
  }

  receiveRequest() {
    return this.handlers.operation.asObservable() as Observable<
      OperationRequest<unknown, Ctx>
    >;
  }
}
