import { OperationRequest } from './OperationRequest';
import { OperationKind } from '../schema/schema.types';
import { Channel } from './communication.types';
import { z } from 'zod';

const operationResponseSchema = z.object({
  operationName: z.string(),
  operationKind: z.nativeEnum(OperationKind),
  request: z.union([OperationRequest.schema, z.null()]),
  result: z.unknown().optional(),
  error: z.unknown().optional(),
  channel: z.unknown().optional(),
});

type OperationResponseObject = z.infer<typeof operationResponseSchema>;

export class OperationResponse<
  Result = unknown,
  Request extends OperationRequest = OperationRequest
> implements OperationResponseObject
{
  static readonly schema = operationResponseSchema;

  constructor(
    public operationName: string,
    public operationKind: OperationKind,
    public request: Request | null,
    public result: Result | null,
    public error: Error | null,
    public channel?: Channel
  ) {
    if (!this.channel) {
      this.channel = request?.channel;
    }
  }

  static fromObject<
    Result,
    Request extends OperationRequest = OperationRequest
  >(data: OperationResponseObject) {
    return new OperationResponse<Result, Request>(
      data.operationName,
      data.operationKind,
      data.request as Request,
      data.result as Result,
      data.error as Error
    );
  }

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
