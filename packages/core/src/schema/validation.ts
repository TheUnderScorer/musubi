import { OperationKind, OperationName, OperationsSchema } from './schema.types';
import { ZodSchema } from 'zod';

export function validatePayload<S extends OperationsSchema, P>(
  schema: S,
  kind: OperationKind,
  name: OperationName,
  payload: P
) {
  const operationKey = resolveSchemaKey(kind);

  const definition = schema[operationKey][name];

  if (definition.payload instanceof ZodSchema) {
    return definition.payload.parse(payload) as P;
  }

  return payload;
}

export function validateResult<S extends OperationsSchema, R>(
  schema: S,
  kind: OperationKind,
  name: OperationName,
  result: R
) {
  const operationKey = resolveSchemaKey(kind);

  const definition = schema[operationKey][name];

  if (definition.result instanceof ZodSchema) {
    return definition.result.parse(result) as R;
  }

  return result;
}

export function resolveSchemaKey(kind: OperationKind): keyof OperationsSchema {
  switch (kind) {
    case OperationKind.Command:
      return 'commands';

    case OperationKind.Query:
      return 'queries';

    case OperationKind.Event:
      return 'events';

    default:
      throw new Error(`Unknown operation kind: ${kind}`);
  }
}
