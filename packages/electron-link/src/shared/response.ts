import { OperationRequest, OperationResponse } from '@musubi/core';

export const makeResponseHandler =
  <Event, Payload, Result, Ctx = unknown>(
    onResponse: (
      event: Event,
      request: OperationResponse<Result, OperationRequest<Payload, Ctx>>
    ) => unknown
  ) =>
  (event: Event, payload: unknown) => {
    const object = OperationResponse.schema.safeParse(payload);

    if (!object.success) {
      return;
    }

    const request = OperationResponse.fromObject<
      Result,
      OperationRequest<Payload, Ctx>
    >(object.data);

    onResponse(event, request);
  };
