import {
  createMusubi,
  defineSchema,
  operation,
  Musubi,
  wait,
} from '@musubi/core';
import { z } from 'zod';
import {
  defineServerSocketMeta,
  GetChannelParams,
  SocketServerChannel,
} from './channel';
import { Server } from 'socket.io';
import { TestClientsPool } from '../testUtils/testClientsPool';
import { SocketServerContext } from './context';
import { createSocketIoServerLink } from './server';

const testObjectSchema = z.object({
  socketId: z.string(),
});

const getChannelHandler = jest.fn();

const schema = defineSchema({
  queries: {
    queryToSocket: operation.query
      .withPayload(testObjectSchema)
      .withResult(testObjectSchema)
      .withMeta(
        defineServerSocketMeta({
          getChannel: getChannelHandler,
        })
      ),
  },
  commands: {},
  events: {
    eventToSocket: operation.event.withPayload(testObjectSchema).withMeta(
      defineServerSocketMeta({
        getChannel: getChannelHandler,
      })
    ),
  },
});

let server: Server;

let serverMusubi: Musubi<
  typeof schema,
  SocketServerContext,
  SocketServerContext
>;

let clientsPool: TestClientsPool<typeof schema>;

const port = 9000;

beforeEach(() => {
  clientsPool = new TestClientsPool(schema, `http://localhost:${port}`);

  server = new Server();

  server.listen(port);

  const link = createSocketIoServerLink(server);

  serverMusubi = createMusubi({
    schema,
    receiverLinks: [link.receiver],
    clientLinks: [link.client],
  });
});

afterEach(() => {
  server.close();

  clientsPool.disconnectClients();
});

describe('resolveSocketChannel', () => {
  it('should use channel from schema meta if it was not passed', async () => {
    const impl = (
      params: GetChannelParams<typeof schema.queries.queryToSocket>
    ) => {
      return {
        socketId: params.payload.socketId,
      } as SocketServerChannel;
    };
    getChannelHandler.mockImplementation(impl);

    const eventHandler = jest.fn();

    const firstClient = await clientsPool.createClient();
    const secondClient = await clientsPool.createClient();

    [firstClient, secondClient].forEach((client) => {
      client.musubi.receiver.handleQuery('queryToSocket', () => ({
        socketId: client.client.id,
      }));

      client.musubi.client.observeEvent('eventToSocket').subscribe(() => {
        eventHandler(client.client.id);
      });
    });

    const result = await serverMusubi.client.query('queryToSocket', {
      socketId: firstClient.client.id,
    });
    expect(result.socketId).toBe(firstClient.client.id);

    await serverMusubi.receiver.dispatchEvent('eventToSocket', {
      socketId: firstClient.client.id,
    });

    await wait(500);

    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect(eventHandler).toHaveBeenCalledWith(firstClient.client.id);

    expect(getChannelHandler).toHaveBeenCalledWith({
      payload: {
        socketId: firstClient.client.id,
      },
      ctx: {},
      server,
    });
  });
});
