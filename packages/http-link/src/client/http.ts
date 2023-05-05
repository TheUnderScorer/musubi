import { MusubiHttpHeaders, MusubiHttpMethod } from '../shared/http.types';
import { OperationRequest, OperationResponse } from '@musubi/core';
import { ClientContext } from './client.types';
import { musubiHeadersDefinitions } from '../shared/http';

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
    const json = request.toJSON();

    const queryInput = {
      name: json.name,
      kind: json.kind,
      payload: json.payload,
    };

    const headersInput = musubiHeadersDefinitions.reduce((acc, entry) => {
      const value = entry.serialize
        ? entry.serialize(json[entry.requestKey])
        : json[entry.requestKey];

      return {
        ...acc,
        [entry.headersKey]: value,
      };
    }, {});

    url.searchParams.set('input', JSON.stringify(queryInput));

    Object.entries(headersInput).forEach(([key, value]) => {
      if (value) {
        requestInit.headers[key] = value.toString();
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
