import { OperationName } from '@musubi/core';

export function toResultName(name: OperationName) {
  return `${name}::Result`;
}
