/* eslint-disable @typescript-eslint/no-explicit-any */
import { OperationDefinition } from './OperationDefinition';
import { OperationsSchema } from './schema.types';

export function defineSchema<S extends OperationsSchema>(
  schema: Pick<S, 'commands' | 'queries' | 'events'>
) {
  return new OperationsSchema(schema.commands, schema.queries, schema.events);
}

export function query() {
  return OperationDefinition.query();
}

export function command() {
  return OperationDefinition.command();
}

export function event() {
  return OperationDefinition.event();
}

type MergeProps<
  T extends Record<string, any>,
  U extends Record<string, any>
> = { [K in keyof T]: K extends keyof U ? never : T[K] } & {
  [K in keyof U]: K extends keyof T ? never : U[K];
} & { [K in keyof T & keyof U]: T[K] & U[K] };

type MergeSchemas<
  Schemas extends Array<OperationsSchema>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Acc extends OperationsSchema = OperationsSchema<{}, {}, {}>
> = Schemas extends [infer Head, ...infer Tail]
  ? MergeSchemas<
      Tail extends Array<OperationsSchema> ? Tail : never,
      {
        queries: MergeProps<
          Acc['queries'],
          Head extends OperationsSchema<any, any, any> ? Head['queries'] : never
        >;
        commands: MergeProps<
          Acc['commands'],
          Head extends OperationsSchema<any, any, any>
            ? Head['commands']
            : never
        >;
        events: MergeProps<
          Acc['events'],
          Head extends OperationsSchema<any, any, any> ? Head['events'] : never
        >;
      }
    >
  : Acc;

export function mergeSchemas<S extends OperationsSchema[]>(
  ...schemas: S
): MergeSchemas<S> {
  const result = schemas.reduce(
    (acc, schema) => {
      acc.queries = {
        ...acc.queries,
        ...schema.queries,
      };

      acc.commands = {
        ...acc.commands,
        ...schema.commands,
      };

      acc.events = {
        ...acc.events,
        ...schema.events,
      };

      return acc;
    },
    {
      events: {},
      commands: {},
      queries: {},
    }
  );

  return result as any;
}
