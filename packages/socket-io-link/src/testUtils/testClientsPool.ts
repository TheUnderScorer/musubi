import { createMusubi, OperationsSchema } from '@musubi/core';
import { io, Socket } from 'socket.io-client';
import { waitForConnect } from './waitForConnect';
import { createSocketIoClientLink } from '../client/client';

export class TestClientsPool<S extends OperationsSchema> {
  clients = new Set<Socket>();

  constructor(private schema: S, private serverUrl: string) {}

  async createClient() {
    const client = io(this.serverUrl, {
      autoConnect: false,
    });

    client.on('connect', () => {
      this.clients.add(client);
    });

    client.on('disconnect', () => {
      this.clients.delete(client);
    });

    client.connect();

    await waitForConnect(client);

    const clientLink = createSocketIoClientLink(client);

    return {
      client,
      musubi: createMusubi({
        schema: this.schema,
        clientLinks: [clientLink.client],
        receiverLinks: [clientLink.receiver],
      }),
    };
  }

  disconnectClients() {
    this.clients.forEach((client) => {
      client.disconnect();
    });
  }
}
