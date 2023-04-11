/* eslint-disable @typescript-eslint/no-explicit-any */

import { ZodSchema } from 'zod';
import { OperationDefinition } from './OperationDefinition';

export type QueryDefinition<
  Name extends OperationName,
  Payload,
  Result
> = OperationDefinition<OperationKind.Query, Name, Payload, Result>;

export type CommandDefinition<
  Name extends OperationName,
  Payload,
  Result
> = OperationDefinition<OperationKind.Command, Name, Payload, Result>;

export type EventDefinition<
  Name extends OperationName,
  Payload
> = OperationDefinition<OperationKind.Event, Name, Payload, void>;

export type DefinitionsRecord<Entry extends OperationDefinition<any, any>> = {
  [key: OperationName]: Entry;
};

export enum OperationKind {
  Query = 'query',
  Command = 'command',
  Event = 'event',
}

export type OptionalPayload<T> = T extends undefined | null ? true : false;

export type ExtractPayload<P extends OperationDefinition<any, any>> =
  P['payload'] extends ZodSchema<infer T> ? T : P['payload'];

export type ExtractResult<P extends OperationDefinition<any, any>> =
  P['result'] extends ZodSchema<infer T> ? T : P['result'];

export type OperationName = string;

// TODO move back to types
export interface OperationsSchema<
  Queries extends DefinitionsRecord<
    QueryDefinition<any, any, any>
  > = DefinitionsRecord<QueryDefinition<any, any, any>>,
  Commands extends DefinitionsRecord<
    CommandDefinition<any, any, any>
  > = DefinitionsRecord<CommandDefinition<any, any, any>>,
  Events extends DefinitionsRecord<
    EventDefinition<any, any>
  > = DefinitionsRecord<EventDefinition<any, any>>
> {
  queries: Queries;
  commands: Commands;
  events: Events;
}
