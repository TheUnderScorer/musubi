import { Server, Socket as ServerSocket } from 'socket.io';
import { io, Socket } from 'socket.io-client';
import { createSocketIoClientLink } from './client/client';
import { createSocketIoServerLink } from './server/server';
import {
  createMusubi,
  defineSchema,
  event,
  mergeSchemas,
  Musubi,
  query,
} from '@musubi/core';
import {
  setupTestUserHandlers,
  testSchema,
} from '../../../tools/test/testMusubi';
import { SocketServerContext } from './server/context';
import { z } from 'zod';
import { wait } from '@nrwl/nx-cloud/lib/utilities/waiter';
import { SocketServerChannel } from './server/channel';
import invariant from 'tiny-invariant';

const serverSchema = defineSchema({
  commands: {},
  events: {
    testFromServer: event().withPayload(
      z.object({
        test: z.boolean(),
      })
    ),
  },
  queries: {
    getSockets: query().withResult(z.array(z.string())),
  },
});

const clientSchema = defineSchema({
  commands: {},
  events: {
    testFromClient: event().withPayload(
      z.object({
        test: z.boolean(),
      })
    ),
  },
  queries: {
    pingClientSocket: query().withResult(z.literal('pong')),
  },
});

const socketTestSchema = mergeSchemas(testSchema, serverSchema, clientSchema);

let server: Server;

const port = 8082;

let serverMusubi: Musubi<
  typeof socketTestSchema,
  SocketServerContext,
  SocketServerContext
>;

const clients: Set<Socket> = new Set();

async function waitForConnect(client: Socket) {
  while (!client.connected) {
    await wait(100);
  }
}

export async function createClient() {
  const client = io(`http://localhost:${port}`, {
    autoConnect: false,
  });

  client.on('connect', () => {
    clients.add(client);
  });

  client.on('disconnect', () => {
    clients.delete(client);
  });

  client.connect();

  await waitForConnect(client);

  const clientLink = createSocketIoClientLink(client);

  return {
    client,
    musubi: createMusubi({
      schema: socketTestSchema,
      clientLinks: [clientLink.client],
      receiverLinks: [clientLink.receiver],
    }),
  };
}

describe('Socket io link', () => {
  beforeEach(() => {
    server = new Server();

    server.listen(port);

    const serverLink = createSocketIoServerLink(server);

    serverMusubi = createMusubi({
      schema: socketTestSchema,
      clientLinks: [serverLink.client],
      receiverLinks: [serverLink.receiver],
    });

    setupTestUserHandlers(serverMusubi.receiver);
  });

  afterEach(() => {
    server.close();

    clients.forEach((client) => {
      client.disconnect();
    });
  });

  it('should pass sending socket in context', async () => {
    const client = await createClient();

    const handler = jest.fn();

    serverMusubi.receiver.handleQuery('getSockets', (_, ctx) => {
      expect(ctx.socket).toBeInstanceOf(ServerSocket);

      handler();

      return Array.from(server.sockets.sockets.values()).map((s) => s.id);
    });

    await client.musubi.client.query('getSockets');

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should send queries and commands from client to server', async () => {
    const { musubi } = await createClient();

    const user = await musubi.client.command('createUser', {
      name: 'test',
    });

    expect(user.name).toBe('test');
  });

  it('should send queries and commands from server to client', async () => {
    const handler = jest.fn().mockReturnValue('pong');
    const secondClientHandler = jest.fn();

    const client = await createClient();
    const secondClient = await createClient();

    client.musubi.receiver.handleQuery('pingClientSocket', handler);

    secondClient.client.onAny(secondClientHandler);

    const result = await serverMusubi.client.query(
      'pingClientSocket',
      undefined,
      {
        socketId: client.client.id,
      } as SocketServerChannel
    );

    expect(result).toBe('pong');

    expect(handler).toBeCalledTimes(1);
    expect(secondClientHandler).toBeCalledTimes(0);
  });

  it('should send events from client to server', async () => {
    const handler = jest.fn();

    const { musubi } = await createClient();

    serverMusubi.client.observeEvent('testFromClient').subscribe(({ ctx }) => {
      expect(ctx.socket).toBeInstanceOf(ServerSocket);

      handler();
    });

    await musubi.receiver.dispatchEvent('testFromClient', {
      test: true,
    });

    await wait(1000);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should support sending messages to different channels', async () => {
    const clients = {
      a: {
        client: await createClient(),
        handler: jest.fn(),
      },
      b: {
        client: await createClient(),
        handler: jest.fn(),
      },
    };

    await wait(1000);

    clients.a.client.musubi.client
      .observeEvent('testFromServer')
      .subscribe(clients.a.handler);
    clients.b.client.musubi.client
      .observeEvent('testFromServer')
      .subscribe(clients.b.handler);

    await serverMusubi.receiver.dispatchEvent('testFromServer', {
      test: true,
    });

    await wait(1000);

    expect(clients.a.handler).toBeCalledTimes(1);
    expect(clients.b.handler).toBeCalledTimes(1);

    const socketA = server.sockets.sockets.get(clients.a.client.client.id);
    invariant(socketA, 'socketA should exist');
    socketA.join('socketA');
    socketA.join('shared');

    const socketB = server.sockets.sockets.get(clients.b.client.client.id);
    invariant(socketB, 'socketB should exist');
    socketB.join('socketB');
    socketB.join('shared');

    // socketA room
    await serverMusubi.receiver.dispatchEvent(
      'testFromServer',
      {
        test: true,
      },
      {
        roomId: 'socketA',
      } as SocketServerChannel
    );
    await wait(1000);
    expect(clients.a.handler).toBeCalledTimes(2);
    expect(clients.b.handler).toBeCalledTimes(1);

    // Shared room
    await serverMusubi.receiver.dispatchEvent(
      'testFromServer',
      {
        test: true,
      },
      {
        roomId: 'shared',
      } as SocketServerChannel
    );
    await wait(1000);
    expect(clients.a.handler).toBeCalledTimes(3);
    expect(clients.b.handler).toBeCalledTimes(2);

    // socketB room
    await serverMusubi.receiver.dispatchEvent(
      'testFromServer',
      { test: true },
      {
        roomId: 'socketB',
      } as SocketServerChannel
    );
    await wait(1000);
    expect(clients.a.handler).toBeCalledTimes(3);
    expect(clients.b.handler).toBeCalledTimes(3);

    // shared room - broadcast from socketB
    await serverMusubi.receiver.dispatchEvent(
      'testFromServer',
      { test: true },
      {
        roomId: 'shared',
        isBroadcast: true,
        socketId: socketB.id,
      } as SocketServerChannel
    );
    await wait(1000);
    expect(clients.a.handler).toBeCalledTimes(4);
    expect(clients.b.handler).toBeCalledTimes(3);

    // to client a
    await serverMusubi.receiver.dispatchEvent(
      'testFromServer',
      { test: true },
      {
        socketId: socketA.id,
      } as SocketServerChannel
    );
    await wait(1000);
    expect(clients.a.handler).toBeCalledTimes(5);
    expect(clients.b.handler).toBeCalledTimes(3);
  }, 9000);
});
