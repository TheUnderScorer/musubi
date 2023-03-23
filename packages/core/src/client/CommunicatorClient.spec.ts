import { CommunicatorClient } from './CommunicatorClient';
import { OperationResponse } from '../shared/OperationResponse';
import { CommunicatorReceiver } from '../receiver/CommunicatorReceiver';
import { mergeSchemas } from '../schema/schemaHelpers';
import { testPostSchema, testUserSchema } from '../test/testSchemas';
import { createTestLink } from '../test/testLink';

const schema = mergeSchemas(testUserSchema, testPostSchema);

const { receiverLink, clientLink } = createTestLink();

describe('CommunicatorClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send channel in request', async () => {
    const channel = {
      test: true,
    };

    const receiver = new CommunicatorReceiver(schema, [receiverLink]);

    receiver.handleCommand('createUser', async (payload) => ({
      name: payload.name,
      id: '1',
    }));

    const client = new CommunicatorClient(schema, [
      {
        sendRequest: async (request, next) => {
          expect(request.channel).toBe(channel);

          const response = await next(request);

          expect(response).toBeInstanceOf(OperationResponse);
          expect(response.channel).toBe(channel);

          return response;
        },
      },
      clientLink,
    ]);

    await client.command('createUser', { name: 'test' }, channel);
  });

  it('should support multiple links', async () => {
    const receiver = new CommunicatorReceiver(schema, [receiverLink]);

    receiver.handleCommand('createUser', async (payload) => ({
      name: payload.name,
      id: '1',
    }));

    const client = new CommunicatorClient(schema, [
      {
        sendRequest: async (request, next) => {
          const response = await next(request);

          expect(response).toBeInstanceOf(OperationResponse);

          return response;
        },
      },
      clientLink,
    ]);

    await client.command('createUser', {
      name: 'Test',
    });
  });

  it('should support multiple links on error', async () => {
    const error = new Error('test');
    const receiver = new CommunicatorReceiver(schema, [receiverLink]);

    receiver.handleCommand('createUser', async () => {
      throw error;
    });

    const client = new CommunicatorClient(schema, [
      {
        sendRequest: async (request, next) => {
          const response = await next(request);

          expect(response).toBeInstanceOf(OperationResponse);
          expect(response.error).toBe(error);
          expect(response.result).toBeNull();

          return response;
        },
      },
      clientLink,
    ]);

    await expect(
      client.command('createUser', {
        name: 'Test',
      })
    ).rejects.toThrow(error);
  });

  it('should support multiple links for events', async () => {
    const onClientEvent = jest.fn();
    const onEvent = jest.fn();

    const onTeardown = jest.fn();

    const receiver = new CommunicatorReceiver(schema, [receiverLink]);

    const client = new CommunicatorClient(schema, [
      {
        subscribeToEvent: (request, next) => {
          const sub = next.subscribe((event) => {
            expect(event).toBeInstanceOf(OperationResponse);

            onClientEvent(event);

            return event;
          });

          sub.add(onTeardown);

          return sub;
        },
      },
      {
        subscribeToEvent: (request, next) => {
          const sub = next.subscribe((event) => {
            onClientEvent(event);

            return event;
          });

          sub.add(onTeardown);

          return sub;
        },
      },
      clientLink,
    ]);

    const eventObservable = client.observeEvent('postCreated');
    const subscription = eventObservable.subscribe(onEvent);

    const payload = {
      id: '1',
      title: '1',
    };
    await receiver.dispatchEvent('postCreated', payload);
    await receiver.dispatchEvent('postCreated', payload);
    await receiver.dispatchEvent('postCreated', payload);

    expect(onClientEvent).toHaveBeenCalledTimes(6);
    expect(onEvent).toHaveBeenCalledTimes(3);
    expect(onEvent).toHaveBeenCalledWith(payload);

    subscription.unsubscribe();

    expect(onTeardown).toHaveBeenCalledTimes(2);

    await receiver.dispatchEvent('postCreated', payload);

    expect(onTeardown).toHaveBeenCalledTimes(2);
    expect(onClientEvent).toHaveBeenCalledTimes(6);
    expect(onEvent).toHaveBeenCalledTimes(3);
    expect(onEvent).toHaveBeenCalledWith(payload);
  });
});
