import { CommunicatorClient } from './CommunicatorClient';
import { OperationResponse } from '../shared/OperationResponse';
import { CommunicatorReceiver } from '../receiver/CommunicatorReceiver';
import { ClientLink } from './client.types';
import { ReceiverLink } from '../receiver/receiver.types';
import { filter, Subject } from 'rxjs';
import { OperationKind, OperationName } from '../schema/schema.types';
import { OperationRequest } from '../shared/OperationRequest';
import { mergeSchemas } from '../schema/schemaHelpers';
import { testPostSchema, testUserSchema } from '../test/testSchemas';

const schema = mergeSchemas(testUserSchema, testPostSchema);

const clientLink = {
  subscribeToEvent: jest.fn(),
  sendRequest: jest.fn(),
} satisfies ClientLink;

const receiverLink = {
  receiveRequest: jest.fn(),
  sendResponse: jest.fn(),
} satisfies ReceiverLink;

describe('CommunicatorClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const newRequest = new Subject<OperationRequest>();
    const newResponse = new Subject<OperationResponse>();
    const newEvent = new Subject<OperationResponse>();

    receiverLink.receiveRequest.mockImplementation((name: OperationName) => {
      return newRequest.pipe(filter((req) => req.name === name));
    });

    receiverLink.sendResponse.mockImplementation(
      (response: OperationResponse) => {
        if (response.operationKind === OperationKind.Event) {
          newEvent.next(response);
        } else {
          newResponse.next(response);
        }
      }
    );

    clientLink.subscribeToEvent.mockImplementation(
      (request: OperationRequest) => {
        return newEvent.pipe(
          filter((res) => res.operationName === request.name)
        );
      }
    );

    clientLink.sendRequest.mockImplementation((request) => {
      return new Promise((resolve) => {
        const sub = newResponse
          .pipe(filter((res) => res.request?.id === request.id))
          .subscribe((response) => {
            sub.unsubscribe();

            resolve(response);
          });

        newRequest.next(request);
      });
    });
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
