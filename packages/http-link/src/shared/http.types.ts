import { OperationRequestObject, OperationResponseObject } from '@musubi/core';

export type MusubiHttpHeaders = Record<string, string>;

export interface MusubiHttpRequest {
  method: MusubiHttpMethod;
  headers: MusubiHttpHeaders;
  payload: OperationRequestObject;
  reply: (response: OperationResponseObject, status: number) => void;
}

export enum MusubiHttpMethod {
  GET = 'GET',
  POST = 'POST',
}
