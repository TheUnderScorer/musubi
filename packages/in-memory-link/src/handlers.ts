/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OperationHandler,
  OperationName,
  OperationRequest,
  OperationResponse,
} from '@musubi/core';
import { Subject } from 'rxjs';

export type EventHandler<Ctx = any> = <Payload>(
  request: OperationRequest<Payload, Ctx>
) => Promise<void>;

export function createHandlers() {
  return {
    commandHandlers: new Map<OperationName, OperationHandler<any>>(),
    queryHandlers: new Map<OperationName, OperationHandler<any>>(),
    operation: new Subject<OperationRequest>(),
    operationResult: new Subject<OperationResponse>(),
    event: new Subject<OperationResponse>(),
  };
}

export type Handlers = ReturnType<typeof createHandlers>;
