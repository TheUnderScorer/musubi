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
import { SharedHttpOptions } from '../shared/options.types';

export class HttpServerReceiverLink<
  S extends OperationsSchema = OperationsSchema
> implements ReceiverLink<ServerContext>
{
  constructor(
    private readonly server: MusubiServerAdapter,
    private readonly schema: S,
    private readonly options?: SharedHttpOptions
  ) {}

  receiveRequest(
    name: OperationName
  ): Observable<OperationRequest<unknown, ServerContext>> {
    const operation = getOperationFromSchema(this.schema, name);

    return this.server
      .observePath(
        getPathNameForOperation(name, this.options?.pathPrefix),
        resolveHttpMethod(operation.kind)
      )
      .pipe(
        map((httpRequest) => {
          const request = OperationRequest.fromUnsafeObject(
            httpRequest.payload
          );

          return request.addCtx<ServerContext>({
            request: {
              isSerializable: false,
              value: httpRequest,
            },
            responseStatusCode: {
              value: 200,
              isSerializable: true,
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

    const responseStatusCode = response.ctx?.responseStatusCode;
    const status = responseStatusCode ?? (response.error ? 500 : 200);

    httpRequest?.reply(response.toJSON(), status);
  }
}
