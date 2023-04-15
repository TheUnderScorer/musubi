import { MusubiHttpHeaders } from '../shared/http.types';
import { OperationRequest } from '@musubi/core';
import { MaybePromise } from 'rollup';

export interface HttpClientLinkOptions {
  /**
   * HTTP Server url
   * */
  url: string;
  fetch?: typeof fetch;
  AbortController?: typeof AbortController;
  headers?:
    | MusubiHttpHeaders
    | ((request: OperationRequest) => MaybePromise<MusubiHttpHeaders>);
}

export interface ClientContext {
  abortController?: AbortController;
}
