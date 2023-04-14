/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery as _useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SetQueryDataFn,
  UseQueryOptions,
  UseQueryReturn,
} from '../hooks.types';
import { useQueryKey } from './useQueryKey';
import { OperationName } from '@musubi/core';
import { useMusubiClient } from '../providers/MusubiProvider';
import { useCallback } from 'react';

export function useQuery<Payload, Result>(
  name: OperationName,
  options?: UseQueryOptions<Payload, Result>
) {
  const variables = options?.variables;
  const queryKey = useQueryKey(name, variables);

  const queryClient = useQueryClient();
  const client = useMusubiClient(options?.musubiContext);

  const query = _useQuery<Result, Error, Payload>(
    queryKey,
    async () => {
      return client.query(name, options?.variables, options?.channel);
    },
    options as UseQueryOptions<any, any>
  );

  const setQueryData = useCallback<SetQueryDataFn<Result>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data) => {
      queryClient.setQueryData(queryKey, data);
    },
    [queryClient, queryKey]
  );

  const cancel = useCallback(async () => {
    await queryClient.cancelQueries({
      queryKey,
    });
  }, [queryKey, queryClient]);

  return {
    ...query,
    key: queryKey,
    setQueryData,
    cancel,
  } as UseQueryReturn<Result>;
}
