import { OperationKind } from '@musubi/core';

import { MusubiHttpMethod } from '../shared/http.types';

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
