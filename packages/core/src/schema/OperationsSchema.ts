/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CommandDefinition,
  DefinitionsRecord,
  EventDefinition,
  QueryDefinition,
} from './schema.types';

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
