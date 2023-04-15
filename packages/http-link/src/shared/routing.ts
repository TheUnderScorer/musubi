import { OperationName } from '@musubi/core';

export function getPathNameForOperation(name: OperationName) {
  return `/api/musubi/${name}`;
}
