import { OperationRequest } from './OperationRequest';
import { OperationKind } from '../schema/schema.types';

export type OperationResponseVariant<Result> =
  | {
      result: Result;
      error: null;
    }
  | {
      result: null;
      error: Error;
    };

export class OperationResponse<
  Result = unknown,
  Request extends OperationRequest = OperationRequest
> {
  constructor(
    public operationName: string,
    public operationKind: OperationKind,
    public request: Request | null,
    public result: Result | null,
    public error: Error | null
  ) {}

  static fromResult<R, Req extends OperationRequest = OperationRequest>(
    operationName: string,
    operationKind: OperationKind,
    result: R,
    req: Req | null
  ) {
    return new OperationResponse(
      operationName,
      operationKind,
      req,
      result,
      null
    );
  }

  static fromError<Result, Req extends OperationRequest = OperationRequest>(
    operationName: string,
    operationKind: OperationKind,
    error: unknown,
    req: Req | null
  ) {
    return new OperationResponse<Result, Req>(
      operationName,
      operationKind,
      req,
      null,
      error instanceof Error ? error : new Error(JSON.stringify(error))
    );
  }

  unwrap() {
    if (this.error) {
      throw this.error;
    }

    return this.result as Result;
  }
}
