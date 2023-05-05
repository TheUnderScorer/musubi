import { ClientContext, HttpClientLinkOptions } from './client.types';
import {
  ClientLink,
  getOperationFromSchema,
  OperationRequest,
  OperationResponse,
  OperationsSchema,
} from '@musubi/core';
import { resolveHttpMethod } from '../server/http';
import { getPathNameForOperation } from '../shared/routing';
import { makeHttpRequest } from './http';

export class HttpClientLink<S extends OperationsSchema = OperationsSchema>
  implements ClientLink<ClientContext>
{
  constructor(
    private readonly options: HttpClientLinkOptions,
    private readonly schema: S
  ) {}

  async sendRequest<Payload, Result>(
    request: OperationRequest<Payload, ClientContext>
  ): Promise<
    OperationResponse<Result, OperationRequest<Payload, ClientContext>>
  > {
    const operation = getOperationFromSchema(this.schema, request.name);

    const fetchFn = this.options.fetch ?? globalThis.fetch;

    const headers =
      typeof this.options.headers === 'function'
        ? await this.options.headers(request)
        : this.options.headers;

    const url = new URL(this.options.url);
    url.pathname = getPathNameForOperation(
      operation.name,
      this.options.pathPrefix
    );

    return makeHttpRequest(
      request,
      url,
      resolveHttpMethod(operation.kind),
      headers,
      fetchFn,
      request.ctx?.abortController?.signal
    );
  }
}
