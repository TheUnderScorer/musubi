import { OperationRequest } from './OperationRequest';
import { OperationKind } from '../schema/schema.types';
import { Channel } from './communication.types';
import { z } from 'zod';
import { OperationEnvelope } from './OperationEnvelope';

const operationResponseSchema = z.object({
  operationName: z.string(),
  operationKind: z.nativeEnum(OperationKind),
  request: z.union([OperationRequest.schema, z.null()]).optional(),
  result: z.unknown().optional(),
  error: z.unknown().optional(),
  channel: z.unknown().optional(),
});

type OperationResponseObject = z.infer<typeof operationResponseSchema>;

export class OperationResponse<
    Result = unknown,
    Request extends OperationRequest = OperationRequest,
    Ctx = OperationRequest['ctx']
  >
  extends OperationEnvelope<Ctx>
  implements OperationResponseObject
{
  static readonly schema = operationResponseSchema;

  constructor(
    public operationName: string,
    public operationKind: OperationKind,
    public request: Request | null,
    public result: Result | null,
    public error: Error | null,
    public channel?: Channel,
    _ctx?: Ctx
  ) {
    const ctx = _ctx ?? request?.ctx;

    super(ctx as Ctx);

    if (!this.channel) {
      this.channel = request?.channel;
    }
  }

  static fromObject<
    Result,
    Request extends OperationRequest = OperationRequest,
    Ctx = Request['ctx']
  >(data: OperationResponseObject, ctx?: Ctx) {
    return new OperationResponse<Result, Request, Ctx>(
      data.operationName,
      data.operationKind,
      data.request
        ? (OperationRequest.fromObject(data.request) as Request)
        : null,
      data.result as Result,
      data.error as Error,
      undefined,
      ctx ?? (data.request?.ctx as Ctx)
    );
  }

  static fromResult<
    R,
    Request extends OperationRequest = OperationRequest,
    Ctx = Request['ctx']
  >(
    operationName: string,
    operationKind: OperationKind,
    result: R,
    req: Request | null,
    ctx?: Ctx
  ) {
    return new OperationResponse(
      operationName,
      operationKind,
      req,
      result,
      null,
      undefined,
      ctx ?? (req?.ctx as Ctx)
    );
  }

  static fromError<
    Result,
    Req extends OperationRequest = OperationRequest,
    Ctx = Req['ctx']
  >(
    operationName: string,
    operationKind: OperationKind,
    error: unknown,
    req: Req | null,
    ctx?: Ctx
  ) {
    return new OperationResponse<Result, Req>(
      operationName,
      operationKind,
      req,
      null,
      error instanceof Error ? error : new Error(JSON.stringify(error)),
      undefined,
      ctx ?? (req?.ctx as Ctx)
    );
  }

  unwrap() {
    if (this.error) {
      throw this.error;
    }

    return this.result as Result;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      request: this.request?.toJSON(),
    };
  }
}
