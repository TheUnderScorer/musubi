import {
  command,
  CommunicatorClient,
  defineSchema,
  CommunicatorReceiver,
  OperationHandler,
  query,
  event,
  mergeSchemas,
} from '@musubi/core';
import { createInMemoryLink } from './link';

describe('InMemoryLink', () => {
  const schema1 = defineSchema({
    commands: {
      testCommand: command()
        .withPayload<{ test: string }>()
        .withResult<{ test: string }>(),
    },
    queries: {
      testQuery: query()
        .withPayload<{ test: string }>()
        .withResult<{ test: string }>(),
    },
    events: {
      testEvent: event().withPayload<{ test: string }>(),
    },
  });
  const schema2 = defineSchema({
    commands: {
      testCommand2: command()
        .withPayload<{ test: string }>()
        .withResult<{ test: string }>(),
    },
    events: {},
    queries: {},
  });

  const fullSchema = mergeSchemas(schema1, schema2);

  const links = createInMemoryLink();

  const client = new CommunicatorClient(fullSchema, [links.client]);
  const receiver = new CommunicatorReceiver(fullSchema, [links.receiver]);

  it('should send and receive commands', async () => {
    const impl: OperationHandler<typeof schema1.commands.testCommand> = async (
      payload
    ) => {
      return payload;
    };
    const handler = jest.fn(impl);

    receiver.handleCommand('testCommand', handler);

    const result = await client.command('testCommand', {
      test: 'test',
    });

    expect(result).toEqual({ test: 'test' });

    expect(handler).toBeCalledTimes(1);
  });

  it('should send and receive queries', async () => {
    const impl: OperationHandler<typeof schema1.queries.testQuery> = async (
      payload
    ) => {
      return payload;
    };
    const handler = jest.fn(impl);

    receiver.handleQuery('testQuery', handler);

    const result = await client.query('testQuery', {
      test: 'test',
    });

    expect(result).toEqual({ test: 'test' });

    expect(handler).toBeCalledTimes(1);
  });

  it('should send and receive events', async () => {
    const handler = jest.fn();

    client.observeEvent('testEvent').subscribe(handler);

    await receiver.dispatchEvent('testEvent', {
      test: 'test',
    });

    await receiver.dispatchEvent('testEvent', {
      test: 'test1',
    });

    expect(handler).toBeCalledTimes(2);
    expect(handler).toBeCalledWith({ test: 'test' });
    expect(handler).toBeCalledWith({ test: 'test1' });
  });
});
