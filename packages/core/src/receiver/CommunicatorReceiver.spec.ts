import { mergeSchemas } from '../schema/schemaHelpers';
import { testPostSchema, testUserSchema } from '../test/testSchemas';
import { createTestLink } from '../test/testLink';
import { CommunicatorReceiver } from './CommunicatorReceiver';
import { CommunicatorClient } from '../client/CommunicatorClient';
import { ZodError } from 'zod';

const schema = mergeSchemas(testUserSchema, testPostSchema);

const { receiverLink, clientLink } = createTestLink();

describe('CommunicatorReceiver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate result', async () => {
    const receiver = new CommunicatorReceiver(schema, [receiverLink]);

    receiver.handleCommand(
      'createUser',
      async (payload) =>
        ({
          nam: payload.name,
          id: '1',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
    );

    const client = new CommunicatorClient(schema, [clientLink]);

    await expect(
      client.command('createUser', { name: 'test' })
    ).rejects.toThrow(ZodError);
  });

  it('should receive channel from client', async () => {
    const channel = {
      test: true,
    };

    const receiver = new CommunicatorReceiver(schema, [
      {
        receiveRequest: (name, next) => {
          return next.subscribe((request) => {
            expect(request.channel).toBe(channel);
          });
        },
      },
      receiverLink,
    ]);

    receiver.handleCommand('createUser', async (payload) => ({
      name: payload.name,
      id: '1',
    }));

    const client = new CommunicatorClient(schema, [clientLink]);

    await client.command('createUser', { name: 'test' }, channel);
  });

  it('should support multiple links for sending response', async () => {
    const onSend = jest.fn();

    const receiver = new CommunicatorReceiver(schema, [
      {
        sendResponse: async (response, next) => {
          onSend(response.unwrap());

          await next(response);
        },
      },
      receiverLink,
    ]);

    receiver.handleCommand('createUser', async (payload) => ({
      name: payload.name,
      id: '1',
    }));

    const client = new CommunicatorClient(schema, [clientLink]);

    const result = await client.command('createUser', { name: 'test' });

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith(result);
  });
});
