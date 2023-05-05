import { OperationName } from '@musubi/core';

export function getPathNameForOperation(
  name: OperationName,
  pathPrefix = '/api'
) {
  return `${pathPrefix}/musubi/${name}`;
}
