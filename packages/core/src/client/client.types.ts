import { OperationRequest } from '../shared/OperationRequest';
import { OperationResponse } from '../shared/OperationResponse';
import { Observable, Subscription } from 'rxjs';

export interface ClientLink<Ctx = unknown> {
  sendRequest?: <Payload, Result>(
    request: OperationRequest<Payload, Ctx>,
    next: (
      request: OperationRequest<Payload, Ctx>
    ) => Promise<OperationResponse<Result, OperationRequest<Payload, Ctx>>>
  ) => Promise<OperationResponse<Result, OperationRequest<Payload, Ctx>>>;

  subscribeToEvent?: <Payload>(
    request: OperationRequest<Payload, Ctx>,
    next: Observable<OperationResponse<Payload, OperationRequest<unknown, Ctx>>>
  ) =>
    | Observable<OperationResponse<Payload, OperationRequest<unknown, Ctx>>>
    | Subscription;
}
