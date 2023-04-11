/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import { OperationDefinition } from './OperationDefinition';
import { OperationsSchema } from './schema.types';
import { mapObject } from '../utils/map';

export function defineSchema<S extends OperationsSchema>(schema: S) {
  return schema;
}

type SchemaExtender<T extends OperationsSchema> = {
  [K in keyof T]?: {
    [P in keyof T[K]]?: (definition: T[K][P]) => T[K][P];
  };
};

type ExtendedSchema<
  BaseSchema extends OperationsSchema,
  Extender extends SchemaExtender<BaseSchema>
> = {
  [K in keyof BaseSchema]: {
    [P in keyof BaseSchema[K]]: P extends keyof Extender[K]
      ? Extender[K][P] extends (...args: any[]) => any
        ? ReturnType<Extender[K][P]>
        : BaseSchema[K][P]
      : BaseSchema[K][P];
  };
};

// TODO Simplify
export function extendSchema<
  BaseSchema extends OperationsSchema,
  Extender extends SchemaExtender<BaseSchema>
>(
  baseSchema: BaseSchema,
  extender: Extender
): ExtendedSchema<BaseSchema, Extender> {
  return {
    commands: mapObject(baseSchema.commands, (value, key) => {
      const typedKey = key as keyof typeof extender.commands;

      if (typeof extender.commands?.[typedKey] === 'function') {
        return extender.commands[typedKey]!(value.clone() as any);
      }

      return value;
    }),
    queries: mapObject(baseSchema.queries, (value, key) => {
      const typedKey = key as keyof typeof extender.queries;

      if (typeof extender.queries?.[typedKey] === 'function') {
        return extender.queries[typedKey]!(value.clone() as any);
      }

      return value;
    }),
    events: mapObject(baseSchema.events, (value, key) => {
      const typedKey = key as keyof typeof extender.events;

      if (typeof extender.events?.[typedKey] === 'function') {
        return extender.events?.[typedKey]!(value.clone() as any);
      }

      return value;
    }),
  } as ExtendedSchema<BaseSchema, Extender>;
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
