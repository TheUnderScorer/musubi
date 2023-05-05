import { OperationKind } from '@musubi/core';

import { MusubiHttpHeaders, MusubiHttpMethod } from '../shared/http.types';
import { musubiHeadersDefinitions } from '../shared/http';
import { z } from 'zod';

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

export function extractRequestDataFromGetRequest(
  queryString: string,
  headers: MusubiHttpHeaders
) {
  const inputFromHeaders = musubiHeadersDefinitions.reduce((acc, value) => {
    return {
      ...acc,
      [value.requestKey]: value.deserialize(headers[value.headersKey] ?? ''),
    };
  }, {});

  return {
    ...JSON.parse(queryString),
    ...inputFromHeaders,
  };
}

export const querySchema = z.object({
  input: z.string(),
});
