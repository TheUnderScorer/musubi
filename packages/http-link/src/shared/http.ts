import { OperationKind } from '@musubi/core';
import { MusubiHttpMethod } from './http.types';

export function resolveKindForMethod(method: MusubiHttpMethod) {
  return method === MusubiHttpMethod.GET
    ? OperationKind.Query
    : OperationKind.Command;
}
