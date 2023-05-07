import { OperationName } from '@musubi/core';

const DEFAULT_PATH_PREFIX = '/api/musubi';

export function getPathNameForOperation(
  name: OperationName,
  pathPrefix = DEFAULT_PATH_PREFIX
) {
  return `${pathPrefix}/${name}`;
}

export function getOperationFromPath(
  path: string,
  pathPrefix = DEFAULT_PATH_PREFIX
) {
  return path.replace(pathPrefix, '');
}
