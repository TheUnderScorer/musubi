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

  const requestInit = {
    method: httpMethod,
    headers: headers ?? {},
    signal,
    body: undefined as string | undefined,
  } satisfies RequestInit;

  if (method === MusubiHttpMethod.GET) {
    requestToQueryParams(request, url.searchParams);

    const json = request.toJSON();

    Object.entries(json).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(
          key,
          typeof value === 'object' ? JSON.stringify(value) : value
        );
      }
    });
  } else {
    requestInit.body = JSON.stringify(request.toJSON());
  }

  const response = await fetchFn(url.toString(), requestInit);

  const json = await response.json();

  const result = OperationResponse.fromUnsafeObject(json);

  return result as OperationResponse<
    Result,
    OperationRequest<Payload, ClientContext>
  >;
}

function requestToQueryParams(
  request: OperationRequest,
  params = new URLSearchParams(),
  path = ''
) {
  Object.entries(request).forEach(([key, value]) => {
    const keyPath = path ? `${path}.${key}` : key;

    if (value) {
      if (keyPath === ('payload' as keyof OperationRequest)) {
        if (typeof value === 'object') {
          requestToQueryParams(value, params, keyPath);
        } else {
          params.set(keyPath, value);
        }

        return;
      }

      params.set(
        keyPath,
        typeof value === 'object' ? JSON.stringify(value) : value
      );
    }
  });

  return params;
}
