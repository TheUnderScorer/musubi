import { OperationRequest } from '@musubi/core';

export enum MusubiHeaders {
  X_MUSUBI_CTX = 'x-musubi-ctx',
  X_MUSUBI_CHANNEL = 'x-musubi-channel',
  X_MUSUBI_ID = 'x-musubi-id',
  X_MUSUBI_TIMESTAMP = 'x-musubi-timestamp',
}

export interface HeadersToRequestFieldMapEntry<
  Key extends keyof OperationRequest = keyof OperationRequest
> {
  headersKey: MusubiHeaders;
  requestKey: Key;
  deserialize: (value: string) => OperationRequest[Key];
  serialize?: (value: OperationRequest[Key]) => string;
}

export const musubiHeadersDefinitions = [
  {
    requestKey: 'ctx',
    headersKey: MusubiHeaders.X_MUSUBI_CTX,
    deserialize: (value: string) => JSON.parse(value),
    serialize: (value: OperationRequest['ctx']) => JSON.stringify(value),
  },
  {
    requestKey: 'channel',
    headersKey: MusubiHeaders.X_MUSUBI_CHANNEL,
    deserialize: (value: string) => value,
  },
  {
    requestKey: 'id',
    headersKey: MusubiHeaders.X_MUSUBI_ID,
    deserialize: (value: string) => value,
  },
  {
    requestKey: 'timestamp',
    headersKey: MusubiHeaders.X_MUSUBI_TIMESTAMP,
    deserialize: (value: string) => parseInt(value),
  },
] satisfies HeadersToRequestFieldMapEntry[];
