import { OperationsSchema } from './schema/schema.types';
import { ClientLink } from './client/client.types';
import { CommunicatorClient } from './client/CommunicatorClient';
import { CommunicatorReceiver } from './receiver/CommunicatorReceiver';
import { ReceiverLink } from './receiver/receiver.types';

export interface MusubiParams<
  S extends OperationsSchema,
  ClientContext = unknown,
  ReceiverContext = unknown
> {
  schema: S;
  clientLinks: ClientLink<ClientContext>[];
  receiverLinks: ReceiverLink<ReceiverContext>[];
}

export function createMusubi<
  S extends OperationsSchema,
  ClientContext = unknown,
  ReceiverContext = unknown
>({
  clientLinks,
  receiverLinks,
  schema,
}: MusubiParams<S, ClientContext, ReceiverContext>) {
  return {
    client: new CommunicatorClient(schema, clientLinks),
    receiver: new CommunicatorReceiver(schema, receiverLinks),
  };
}
