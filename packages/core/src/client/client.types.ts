import { OperationRequest } from '../shared/OperationRequest';
import { OperationResponse } from '../shared/OperationResponse';
import { Observable } from 'rxjs';

export interface ClientLink<Ctx = unknown> {
  sendRequest: <Payload, Result>(
    request: OperationRequest<Payload, Ctx>,
    next: (
      request: OperationRequest<Payload, Ctx>
    ) => Promise<OperationResponse<Result, OperationRequest<Payload, Ctx>>>
  ) => Promise<OperationResponse<Result, OperationRequest<Payload, Ctx>>>;

  subscribeToEvent: <Payload, Result>(
    request: OperationRequest<Payload, Ctx>,
    next: Observable<OperationResponse<Result, OperationRequest<Payload, Ctx>>>
  ) => Observable<OperationResponse<Result, OperationRequest<Payload, Ctx>>>;
}
