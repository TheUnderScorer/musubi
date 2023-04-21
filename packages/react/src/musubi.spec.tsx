import { createReactMusubi } from './musubi';
import { MusubiProvider } from './providers/MusubiProvider';
import { QueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { PropsWithChildren, useState } from 'react';
import { createTestMusubi, testSchema } from '../../../tools/test/testMusubi';
import { wait } from '@nrwl/nx-cloud/lib/utilities/waiter';
import { Subject, Subscription } from 'rxjs';

const m = createReactMusubi(testSchema);

let queryClient: QueryClient;
let testMusubi: ReturnType<typeof createTestMusubi>;

function Wrapper(props: PropsWithChildren) {
  return (
    <MusubiProvider queryClient={queryClient} client={testMusubi.musubi.client}>
      {props.children}
    </MusubiProvider>
  );
}

beforeEach(() => {
  jest.resetAllMocks();

  queryClient = new QueryClient();
  testMusubi = createTestMusubi();
});

describe('useCommand, useQuery', () => {
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
  it('should subscribe to event', async () => {
    const handler = jest.fn();

    renderHook(() => m.userCreated.useEvent(handler), {
      wrapper: Wrapper,
    });

    const commandHook = renderHook(() => m.createUser.useCommand(), {
      wrapper: Wrapper,
    });

    const user = await commandHook.result.current.mutateAsync({
      name: 'John',
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ payload: user, ctx: {} });
  });

  it('should correctly unsubscribe once hook is unmounted', () => {
    const unsubscribeSpy = jest.spyOn(Subscription.prototype, 'unsubscribe');
    const completeSpy = jest.spyOn(Subject.prototype, 'complete');

    const handler = jest.fn();

    const hook = renderHook(() => m.userCreated.useEvent(handler), {
      wrapper: Wrapper,
    });

    act(() => {
      hook.unmount();
    });

    expect(completeSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribeSpy).toHaveBeenCalledTimes(6);
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
