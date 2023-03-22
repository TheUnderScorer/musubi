import {
  OperationName,
  OperationRequest,
  OperationResponse,
} from '@musubi/core';
import { Subject } from 'rxjs';

export type Handler<Ctx = unknown> = <Payload, Result>(
  request: OperationRequest<Payload, Ctx>
) => Promise<OperationResponse<Result, OperationRequest<Payload, Ctx>>>;

export type EventHandler<Ctx = unknown> = <Payload>(
  request: OperationRequest<Payload, Ctx>
) => Promise<void>;

export function createHandlers() {
  return {
    commandHandlers: new Map<OperationName, Handler>(),
    queryHandlers: new Map<OperationName, Handler>(),
    operation: new Subject<OperationRequest>(),
    operationResult: new Subject<OperationResponse>(),
    event: new Subject<OperationResponse>(),
  };
}

export type Handlers = ReturnType<typeof createHandlers>;
