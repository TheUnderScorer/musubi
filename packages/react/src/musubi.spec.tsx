import { createReactMusubi } from './musubi';
import { MusubiProvider } from './providers/MusubiProvider';
import { QueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { PropsWithChildren, useState } from 'react';
import {
  setupTestUserHandlers,
  testSchema,
} from '../../../tools/test/testMusubi';
import { wait } from 'nx-cloud/lib/utilities/waiter';
import {
  createMusubi,
  defineSchema,
  mergeSchemas,
  Musubi,
  operation,
} from '@musubi/core';
import { createInMemoryLink } from '@musubi/in-memory-link';

const testReactSchema = mergeSchemas(
  testSchema,
  defineSchema({
    queries: {
      testUndefinedToNull: operation.query,
    },
    commands: {},
    events: {},
  })
);

const m = createReactMusubi(testReactSchema);

let queryClient: QueryClient;
let musubi: Musubi<typeof testReactSchema>;

function Wrapper(props: PropsWithChildren) {
  return (
    <MusubiProvider queryClient={queryClient} client={musubi.client}>
      {props.children}
    </MusubiProvider>
  );
}

beforeEach(() => {
  jest.resetAllMocks();

  const link = createInMemoryLink();

  queryClient = new QueryClient();

  musubi = createMusubi({
    schema: testReactSchema,
    clientLinks: [link.client],
    receiverLinks: [link.receiver],
  });

  setupTestUserHandlers(musubi.receiver);
});

describe('useCommand, useQuery', () => {
  it('should convert undefined to null from queries', async () => {
    musubi.receiver.handleQuery('testUndefinedToNull', () => {
      return undefined;
    });

    const queryHook = renderHook(() => m.testUndefinedToNull.useQuery(), {
      wrapper: Wrapper,
    });
    const queryResult = await queryHook.result.current.refetch();

    expect(queryResult.data).toBeNull();
  });

  it('should work', async () => {
    const commandHook = renderHook(() => m.createUser.useCommand(), {
      wrapper: Wrapper,
    });

    const commandResult = await commandHook.result.current.mutateAsync({
      name: 'John',
    });
    expect(commandResult.name).toBe('John');

    const queryHook = renderHook(
      () =>
        m.getUser.useQuery({
          variables: {
            id: commandResult.id,
          },
          onSuccess: (data) => {
            expect(data?.name).toBeTruthy();
          },
        }),
      {
        wrapper: Wrapper,
      }
    );
    const queryResult = await queryHook.result.current.refetch();
    expect(queryResult.data).toEqual(commandResult);
  });
});

describe('useEvent', () => {
  it('should subscribe to event and unsubscribe correctly on unmount', async () => {
    const handler = jest.fn();

    const orgObserveEvent = musubi.client.observeEvent.bind(musubi.client);

    let unsubCallCount = 0;

    jest.spyOn(musubi.client, 'observeEvent').mockImplementation((name) => {
      const observable = orgObserveEvent(name);

      const orgSubscribe = observable.subscribe.bind(observable);

      if (name === 'userCreated') {
        jest.spyOn(observable, 'subscribe').mockImplementation((handler) => {
          const subscription = orgSubscribe(handler);

          const orgUnsub = subscription.unsubscribe.bind(subscription);

          jest.spyOn(subscription, 'unsubscribe').mockImplementation(() => {
            unsubCallCount++;

            return orgUnsub();
          });

          return subscription;
        });
      }

      return observable;
    });

    const useMockHook = () => {
      const [count, setCount] = useState(0);

      m.userCreated.useEvent(
        (args) => {
          handler(args);

          // Changing count should cause the hook to unsubscribe to the event and subscribe again
          setCount(count + 1);
        },
        [count]
      );
    };

    const hook = renderHook(() => useMockHook(), {
      wrapper: Wrapper,
    });

    const commandHook = renderHook(() => m.createUser.useCommand(), {
      wrapper: Wrapper,
    });

    const user = await act(() =>
      commandHook.result.current.mutateAsync({
        name: 'John',
      })
    );

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ payload: user, ctx: {} });

    // Trigger event again
    await act(() =>
      commandHook.result.current.mutateAsync({
        name: 'Greg',
      })
    );

    expect(handler).toHaveBeenCalledTimes(2);

    expect(unsubCallCount).toEqual(2);

    hook.unmount();

    expect(unsubCallCount).toEqual(3);
  });

  it('should support passing placeholder data to query', () => {
    const placeholderData = {
      id: '1234',
      name: 'John',
    } as const;

    const hook = renderHook(
      () =>
        m.getUser.useQuery({
          placeholderData,
        }),
      {
        wrapper: Wrapper,
      }
    );

    expect(hook.result.current.isPlaceholderData).toBe(true);
    expect(hook.result.current.data).toEqual(placeholderData);
  });

  it('should correctly receive events even when dependency changes', async () => {
    const handler = jest.fn();

    const useTestHook = async () => {
      const [count, setCount] = useState(0);

      m.userCreated.useEvent(() => {
        handler(count);

        setCount(count + 1);
      }, [count]);
    };

    renderHook(() => useTestHook(), {
      wrapper: Wrapper,
    });

    const commandHook = renderHook(() => m.createUser.useCommand(), {
      wrapper: Wrapper,
    });

    const mutate = async (waitMs = 5) => {
      await act(async () => {
        await commandHook.result.current.mutateAsync({
          name: 'John',
        });
      });

      await act(async () => {
        await wait(waitMs);
      });
    };

    await mutate();
    await mutate();
    await mutate();
    await mutate();
    await mutate();

    expect(handler).toHaveBeenCalledTimes(5);
    expect(handler).toHaveBeenNthCalledWith(1, 0);
    expect(handler).toHaveBeenNthCalledWith(2, 1);
    expect(handler).toHaveBeenNthCalledWith(3, 2);
    expect(handler).toHaveBeenNthCalledWith(4, 3);
    expect(handler).toHaveBeenNthCalledWith(5, 4);
  });
});
