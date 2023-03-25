import { OperationRequest } from '../shared/OperationRequest';
import { OperationResponse } from '../shared/OperationResponse';
import { Observable, Subscription } from 'rxjs';
import {
  ExtractPayload,
  ExtractResult,
  OperationName,
} from '../schema/schema.types';
import { OperationDefinition } from '../schema/OperationDefinition';

export type ReceiverLink<Ctx = unknown> = {
  /**
   * This method is responsible for receiving requests that come from client
   *
   * @see {ClientLink}
   * */
  receiveRequest?: (
    name: OperationName,
    next: Observable<OperationRequest<unknown, Ctx>>
  ) => Observable<OperationRequest<unknown, Ctx>> | Subscription;

  /**
   * This method is responsible for sending responses to client.
   * It handles both operation responses and events.
   *
   * You can use `response.kind` to distinguish between them.
   * */
  sendResponse?: <Payload, Result>(
    response: OperationResponse<Result, OperationRequest<Payload, Ctx>>,
    next: (
      response: OperationResponse<Result, OperationRequest<Payload, Ctx>>
    ) => Promise<void>
  ) => Promise<void>;
};

export type OperationHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  O extends OperationDefinition<any, any, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Ctx = any
> = (payload: ExtractPayload<O>, ctx: Ctx) => Promise<ExtractResult<O>>;
