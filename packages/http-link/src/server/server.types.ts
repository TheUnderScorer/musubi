import { OperationRequest, OperationResponse } from '@musubi/core';
import { Observable } from 'rxjs';
import { MusubiHttpMethod, MusubiHttpRequest } from '../shared/http.types';

export interface ObserverPathResult {
  httpRequest: MusubiHttpRequest;
  operationRequest: OperationRequest;
}

export interface MusubiServerAdapter {
  observePath: (
    path: string,
    method: MusubiHttpMethod
  ) => Observable<ObserverPathResult>;
}

export interface ServerContext {
  request: MusubiHttpRequest;
  responseStatusCode?: number;
}

export type MusubiHttpListener = (
  request: MusubiHttpRequest
) => Promise<OperationResponse>;
