import { Channel, OperationName } from '@musubi/core';
import { DefaultContext, useMusubiClient } from '../providers/MusubiProvider';
import { useEffect, useMemo, useRef } from 'react';

export function useEvent<Payload>(
  name: OperationName,
  handler: (payload: Payload) => void,
  deps?: unknown[],
  channel?: Channel,
  ctx = DefaultContext
) {
  const client = useMusubiClient(ctx);

  const observerRef = useRef(client.observeEvent(name, channel));

  const allDeps = useMemo(() => {
    if (!deps) {
      return [name];
    }

    return [name, ...deps];
  }, [name, deps]);

  useEffect(() => {
    observerRef.current = client.observeEvent(name, channel);
  }, [client, name, channel]);

  useEffect(() => {
    const subscription = observerRef.current.subscribe(async (value) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await handler(value as any);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, allDeps);
}
