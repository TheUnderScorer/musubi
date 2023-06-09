import { OperationRequest } from '../shared/OperationRequest';
import { OperationResponse } from '../shared/OperationResponse';
import { Observable, Subscription } from 'rxjs';

export interface ClientLink<Ctx = unknown> {
  /**
   * Sends request to the receiver and returns a response.
   * */
  sendRequest?: <Payload, Result>(
    request: OperationRequest<Payload, Ctx>,
    next: (
      request: OperationRequest<Payload, Ctx>
    ) => Promise<OperationResponse<Result, OperationRequest<Payload, Ctx>>>
  ) => Promise<OperationResponse<Result, OperationRequest<Payload, Ctx>>>;

  /**
   * Subscribes to the receiver event and returns a subscription.
   * */
  subscribeToEvent?: <Payload>(
    request: OperationRequest<unknown, Ctx>,
    next: Observable<OperationResponse<Payload, OperationRequest<unknown, Ctx>>>
  ) =>
    | Observable<OperationResponse<Payload, OperationRequest<unknown, Ctx>>>
    | Subscription;
}

export interface OperationEvent<Payload, Ctx> {
  payload: Payload;
  ctx: Ctx;
}
