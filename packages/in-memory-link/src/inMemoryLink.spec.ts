import {
  command,
  CommunicatorClient,
  CommunicatorReceiver,
  defineSchema,
  event,
  OperationHandler,
  query,
} from '@musubi/core';
import { createInMemoryLink } from './link';

describe('InMemoryLink', () => {
  const schema = defineSchema({
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

  const links = createInMemoryLink();

  const client = new CommunicatorClient(schema, [links.client]);
  const receiver = new CommunicatorReceiver(schema, [links.receiver]);

  it('should send and receive commands', async () => {
    const impl: OperationHandler<typeof schema.commands.testCommand> = async (
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
    const impl: OperationHandler<typeof schema.queries.testQuery> = async (
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
