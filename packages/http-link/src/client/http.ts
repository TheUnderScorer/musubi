import { MusubiHttpHeaders, MusubiHttpMethod } from '../shared/http.types';
import { OperationRequest, OperationResponse } from '@musubi/core';
import { ClientContext } from './client.types';

export async function makeHttpRequest<Payload, Result>(
  request: OperationRequest<Payload>,
  url: URL,
  method: MusubiHttpMethod,
  headers: MusubiHttpHeaders | undefined,
  fetchFn: typeof fetch,
  signal?: AbortSignal
) {
  const httpMethod = method.toLowerCase() as Lowercase<MusubiHttpMethod>;

  const requestInit: RequestInit = {
    method: httpMethod,
    headers,
    signal,
  };

  if (method === MusubiHttpMethod.GET) {
    const json = request.toJSON();

    url.searchParams.set('input', JSON.stringify(json));
  } else {
    requestInit.body = JSON.stringify(request.toJSON());
  }

  const response = await fetchFn(url.toString(), requestInit);

  const json = await response.json();

  return OperationResponse.fromObject(
    OperationResponse.schema.parse(json)
  ) as OperationResponse<Result, OperationRequest<Payload, ClientContext>>;
}
