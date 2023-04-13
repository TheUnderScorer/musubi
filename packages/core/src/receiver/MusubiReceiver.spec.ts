import { mergeSchemas } from '../schema/schemaHelpers';
import { testPostSchema, testUserSchema } from '../test/testSchemas';
import { createTestLink } from '../test/testLink';
import { MusubiReceiver } from './MusubiReceiver';
import { MusubiClient } from '../client/MusubiClient';
import { ZodError } from 'zod';

const schema = mergeSchemas(testUserSchema, testPostSchema);

describe('MusubiReceiver', () => {
  let receiverLink: ReturnType<typeof createTestLink>['receiverLink'];
  let clientLink: ReturnType<typeof createTestLink>['clientLink'];

  beforeEach(() => {
    jest.clearAllMocks();

    const link = createTestLink();

    receiverLink = link.receiverLink;
    clientLink = link.clientLink;
  });

  it('should validate result', async () => {
    const receiver = new MusubiReceiver(schema, [receiverLink]);

    receiver.handleCommand(
      'createUser',
      async (payload) =>
        ({
          nam: payload.name,
          id: '1',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
    );

    const client = new MusubiClient(schema, [clientLink]);

    await expect(
      client.command('createUser', { name: 'test' })
    ).rejects.toThrow(ZodError);
  });

  it('should receive channel from client', async () => {
    const channel = {
      test: true,
    };

    const receiver = new MusubiReceiver(schema, [
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

    const client = new MusubiClient(schema, [clientLink]);

    await client.command('createUser', { name: 'test' }, channel);
  });

  it('should support multiple links for sending response', async () => {
    const onSend = jest.fn();

    const receiver = new MusubiReceiver(schema, [
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

    const client = new MusubiClient(schema, [clientLink]);

    const result = await client.command('createUser', { name: 'test' });

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith(result);
  });
});
