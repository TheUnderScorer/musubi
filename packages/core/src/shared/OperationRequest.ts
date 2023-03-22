import { OperationKind, OperationName } from '../schema/schema.types';
import { Channel } from './communication.types';
import { generateUUIDv4 } from '../utils/id';

export class OperationRequest<Payload = unknown, Ctx = unknown> {
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
}
