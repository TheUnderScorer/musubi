/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Observable,
  OperationHandler,
  OperationName,
  OperationRequest,
  OperationResponse,
} from '@musubi/core';

export type EventHandler<Ctx = any> = <Payload>(
  request: OperationRequest<Payload, Ctx>
) => Promise<void>;

export function createHandlers() {
  return {
    commandHandlers: new Map<OperationName, OperationHandler<any>>(),
    queryHandlers: new Map<OperationName, OperationHandler<any>>(),
    operation: new Observable<OperationRequest>(),
    operationResult: new Observable<OperationResponse>(),
    event: new Observable<OperationResponse>(),
  };
}

export type Handlers = ReturnType<typeof createHandlers>;
