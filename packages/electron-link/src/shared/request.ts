import { OperationRequest } from '@musubi/core';

export const makeRequestHandler =
  <Event, Payload, Ctx>(
    onRequest: (
      event: Event,
      request: OperationRequest<Payload, Ctx>
    ) => unknown
  ) =>
  (event: Event, payload: unknown) => {
    const object = OperationRequest.schema.safeParse(payload);

    if (!object.success) {
      return;
    }

    const request = OperationRequest.fromObject<Payload, Ctx>(object.data);

    onRequest(event, request);
  };
