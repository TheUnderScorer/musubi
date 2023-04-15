import {
  getOperationFromSchema,
  OperationName,
  OperationRequest,
  OperationResponse,
  OperationsSchema,
  ReceiverLink,
} from '@musubi/core';
import { MusubiServerAdapter, ServerContext } from './server.types';
import { map, Observable } from 'rxjs';
import { resolveHttpMethod } from './http';
import { getPathNameForOperation } from '../shared/routing';

export class HttpServerReceiverLink<
  S extends OperationsSchema = OperationsSchema
> implements ReceiverLink<ServerContext>
{
  constructor(
    private readonly server: MusubiServerAdapter,
    private readonly schema: S
  ) {}

  receiveRequest(
    name: OperationName
  ): Observable<OperationRequest<unknown, ServerContext>> {
    const operation = getOperationFromSchema(this.schema, name);

    return this.server
      .observePath(
        getPathNameForOperation(name),
        resolveHttpMethod(operation.kind)
      )
      .pipe(
        map((httpRequest) => {
          const request = OperationRequest.fromObject(
            OperationRequest.schema.parse(httpRequest.payload)
          );

          return request.addCtx<ServerContext>({
            request: {
              isSerializable: false,
              value: httpRequest,
            },
          });
        })
      );
  }

  async sendResponse<Payload, Result>(
    response: OperationResponse<
      Result,
      OperationRequest<Payload, ServerContext>,
      ServerContext
    >
  ) {
    const httpRequest = response.ctx.request ?? response.request?.ctx.request;

    const status =
      response.ctx?.responseStatusCode ?? response.error ? 500 : 200;

    httpRequest?.reply(response.toJSON(), status);
  }
}
