import { mergeSchemas } from '../schema/schemaHelpers';
import {
  testPostSchema,
  testUserSchema,
} from '../../../../tools/test/testSchemas';
import { createTestLink } from '../../../../tools/test/testLink';
import { MusubiReceiver } from './MusubiReceiver';
import { MusubiClient } from '../client/MusubiClient';
import { ZodError } from 'zod';
import { OperationBeforeMiddleware } from './OperationReceiverBuilder';
import { OperationDefinition } from '../schema/OperationDefinition';

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

  describe('Operation Builder', () => {
    it('should pass result to middleware after', async () => {
      const client = new MusubiClient(schema, [clientLink]);

      const receiver = new MusubiReceiver<typeof schema, { fromLink: true }>(
        schema,
        [receiverLink]
      );

      receiver
        .handleQueryBuilder('getPost')
        .runAfter(({ data }) => {
          expect(data.error).toBeNull();

          if (!data.error) {
            expect(data.result.id).toBe('1');
            expect(data.result.title).toBe('test');
          }
        })
        .withHandler((payload) => {
          return {
            id: payload.id,
            title: 'test',
          };
        })
        .register();

      const result = await client.query('getPost', { id: '1' });

      expect(result).toEqual({
        id: '1',
        title: 'test',
      });
    });

    it('should pass error from middleware before', async () => {
      const client = new MusubiClient(schema, [clientLink]);

      const receiver = new MusubiReceiver<typeof schema, { fromLink: true }>(
        schema,
        [receiverLink]
      );

      const runAfter = jest.fn();
      const nextMiddleware = jest.fn();
      const handler = jest.fn();

      receiver
        .handleQueryBuilder('getPost')
        .runBefore(() => {
          throw new Error('Middleware thrown error');
        })
        .runBefore(nextMiddleware)
        .runAfter(({ data, operation }) => {
          expect(operation).toEqual(schema.queries.getPost);
          expect(data.error).toBeTruthy();

          if (data.error) {
            expect(data.error.message).toBe('Middleware thrown error');
          }

          runAfter();
        })
        .withHandler(handler)
        .register();

      await expect(client.query('getPost', { id: '1' })).rejects.toThrow(
        'Middleware thrown error'
      );

      expect(handler).toHaveBeenCalledTimes(0);
      expect(runAfter).toHaveBeenCalledTimes(1);
      expect(nextMiddleware).toHaveBeenCalledTimes(0);
    });

    it('should pass error to middleware after if handler throws', async () => {
      const client = new MusubiClient(schema, [clientLink]);

      const receiver = new MusubiReceiver<typeof schema, { fromLink: true }>(
        schema,
        [receiverLink]
      );

      receiver
        .handleQueryBuilder('getPost')
        .runAfter(({ data, operation }) => {
          expect(operation).toEqual(schema.queries.getPost);
          expect(data.error).toBeTruthy();

          if (data.error) {
            expect(data.error.message).toBe('Post not found');
          }
        })
        .withHandler(() => {
          throw new Error('Post not found');
        })
        .register();

      await expect(client.query('getPost', { id: '1' })).rejects.toThrow(
        'Post not found'
      );
    });

    it('should support altering context for middleware before', async () => {
      const client = new MusubiClient(schema, [clientLink]);

      const receiver = new MusubiReceiver<typeof schema, { fromLink: true }>(
        schema,
        [
          {
            receiveRequest: (name, next) => {
              return next.subscribe((request) => {
                request.addCtx({
                  fromLink: {
                    isSerializable: true,
                    value: true,
                  },
                });
              });
            },
          },
          receiverLink,
        ]
      );

      const middleware =
        <
          Operation extends OperationDefinition,
          Ctx
        >(): OperationBeforeMiddleware<
          Operation,
          Ctx,
          Ctx & { fromMiddleware: true }
        > =>
        ({ ctx, operation }) => {
          expect(operation).toEqual(schema.commands.createUser);

          return {
            ...ctx,
            fromMiddleware: true,
          };
        };

      receiver
        .handleCommandBuilder('createUser')
        .runBefore(middleware())
        .runBefore(({ ctx }) => {
          expect(ctx.fromLink).toBe(true);
          expect(ctx.fromMiddleware).toBe(true);

          return {
            ...ctx,
            fromSecondMiddleware: true,
          };
        })
        .withHandler(async (payload, ctx) => {
          expect(ctx.fromLink).toBe(true);
          expect(ctx.fromMiddleware).toBe(true);
          expect(ctx.fromSecondMiddleware).toBe(true);

          return {
            id: '1',
            name: payload.name,
          };
        })
        .register();

      const user = await client.command('createUser', {
        name: 'test',
      });

      expect(user).toEqual({
        id: '1',
        name: 'test',
      });
    });
  });
});
