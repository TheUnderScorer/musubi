import {
  generateUUIDv4,
  OperationKind,
  OperationRequest,
  OperationRequestObject,
} from '@musubi/core';

import {
  MusubiHttpMethod,
  MusubiHttpRequest,
  MusubiQueryParams,
} from '../shared/http.types';
import { SharedHttpOptions } from '../shared/options.types';
import { getOperationFromPath } from '../shared/routing';
import { resolveKindForMethod } from '../shared/http';

export function resolveHttpMethod(kind: OperationKind) {
  switch (kind) {
    case OperationKind.Query:
      return MusubiHttpMethod.GET;

    case OperationKind.Command:
    case OperationKind.Event:
      return MusubiHttpMethod.POST;

    default:
      throw new Error(`Unsupported operation kind: ${kind}`);
  }
}

export function parseMusubiHttpRequest(
  request: MusubiHttpRequest
): OperationRequest {
  switch (request.method) {
    case MusubiHttpMethod.GET:
      return extractMusubiRequestFromQuery(request);

    default:
      return OperationRequest.fromUnsafeObject(request.body);
  }
}

export function extractMusubiRequestFromQuery(
  { queryParams = {}, path, method }: MusubiHttpRequest,
  options?: SharedHttpOptions
): OperationRequest {
  const requestData: OperationRequestObject = {
    name: queryParams.name ?? getOperationFromPath(path, options?.pathPrefix),
    timestamp: queryParams.timestamp
      ? Number(queryParams.timestamp)
      : Date.now(),
    channel: queryParams.channel,
    ctx: queryParams.ctx ? JSON.parse(queryParams.ctx) : {},
    kind: queryParams.kind ?? resolveKindForMethod(method),
    payload: extractPayloadFromQuery(queryParams),
    id: queryParams.id ?? generateUUIDv4(),
  };

  return OperationRequest.fromUnsafeObject(requestData);
}

function extractPayloadFromQuery(queryParams: MusubiQueryParams) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const result: any = {};

  Object.entries(queryParams).forEach(([key, value]) => {
    if (key.startsWith('payload.')) {
      const payloadKey = key.replace('payload.', '');

      try {
        result[payloadKey] = JSON.parse(value);
      } catch {
        result[payloadKey] = value;
      }
    }
  });

  return result;
}
