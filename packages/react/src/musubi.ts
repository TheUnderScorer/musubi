import {
  OperationDefinition,
  OperationKind,
  OperationName,
  OperationsSchema,
} from '@musubi/core';
import {
  ReactHookForOperation,
  ReactOperationsSchema,
  UseCommandProperty,
  UseEventProperty,
  UseQueryProperty,
} from './hooks.types';
import { useQuery } from './hooks/useQuery';
import { useCommand } from './hooks/useCommand';
import { useEvent } from './hooks/useEvent';

export function createReactMusubi<Schema extends OperationsSchema>(
  schema: Schema
): ReactOperationsSchema<Schema> {
  return createProxyForSchema(schema);
}

export function createProxyForSchema<Schema extends OperationsSchema>(
  schema: Schema
) {
  return new Proxy(
    {},
    {
      get: (target, p) => {
        const key = p.toString() as OperationName;

        return Object.values(schema).reduce((acc, operations) => {
          const definition = operations[key] as OperationDefinition | undefined;

          if (definition) {
            const hook = buildHookForOperation(key, definition);

            if (hook) {
              Object.assign(acc, hook);
            }
          }

          return acc;
        }, {} as ReactHookForOperation<OperationDefinition>);
      },
    }
  ) as ReactOperationsSchema<Schema>;
}

function buildHookForOperation(
  key: OperationName,
  definition: OperationDefinition
) {
  switch (definition.kind) {
    case OperationKind.Query:
      return {
        useQuery: (options) => useQuery(key, options),
      } as UseQueryProperty<
        OperationKind.Query,
        OperationDefinition<OperationKind.Query>
      >;

    case OperationKind.Command:
      return {
        useCommand: (options) => useCommand(key, options),
      } as UseCommandProperty<
        OperationKind.Command,
        OperationDefinition<OperationKind.Command>
      >;

    case OperationKind.Event:
      return {
        useEvent: (handler, deps, channel) =>
          useEvent(key, handler, deps, channel),
      } as UseEventProperty<
        OperationKind.Event,
        OperationDefinition<OperationKind.Event>
      >;

    default:
      return null;
  }
}
