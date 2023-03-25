import { OperationKind, OperationName } from '../schema/schema.types';
import { Channel } from './communication.types';
import { generateUUIDv4 } from '../utils/id';
import { z } from 'zod';

const operationRequestSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.nativeEnum(OperationKind),
  payload: z.unknown().optional(),
  timestamp: z.number(),
  channel: z.unknown().optional(),
  ctx: z.unknown().optional(),
});

type OperationRequestObject = z.infer<typeof operationRequestSchema>;

export class OperationRequest<Payload = unknown, Ctx = unknown>
  implements OperationRequestObject
{
  static readonly schema = operationRequestSchema;

  id: string;

  timestamp: number;

  constructor(
    public name: OperationName,
    public kind: OperationKind,
    public payload: Payload,
    public channel?: Channel,
    public ctx?: Ctx
  ) {
    this.id = generateUUIDv4();
    this.timestamp = Date.now();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCtx<T extends Record<string, any>>(values: T) {
    Object.assign(this, {
      ctx: {
        ...this.ctx,
        ...values,
      },
    });

    return this as unknown as OperationRequest<Payload, Ctx & T>;
  }

  static fromObject<Payload, Ctx>(data: OperationRequestObject) {
    const request = new OperationRequest<Payload, Ctx>(
      data.name,
      data.kind,
      data.payload as Payload,
      data.channel as Channel,
      data.ctx as Ctx
    );
    request.id = data.id;
    request.timestamp = data.timestamp;

    return request;
  }
}
