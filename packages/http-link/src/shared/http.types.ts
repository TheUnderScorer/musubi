import { OperationResponseObject } from '@musubi/core';

export type MusubiHttpHeaders = Record<string, string>;

export interface MusubiHttpRequestReplyParams {
  response: OperationResponseObject;
  status: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MusubiQueryParams = Record<string, any>;

export interface MusubiHttpRequest {
  method: MusubiHttpMethod;
  headers: MusubiHttpHeaders;
  queryParams?: MusubiQueryParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  path: string;

  reply: (params: MusubiHttpRequestReplyParams) => void;
}

export enum MusubiHttpMethod {
  GET = 'GET',
  POST = 'POST',
}
