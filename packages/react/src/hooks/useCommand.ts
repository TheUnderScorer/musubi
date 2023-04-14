/* eslint-disable @typescript-eslint/no-explicit-any */
import { OperationName } from '@musubi/core';
import { UseCommandOptions, UseCommandReturn } from '../hooks.types';
import { useQueryKey } from './useQueryKey';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMusubiClient } from '../providers/MusubiProvider';

export function useCommand<Payload, Result>(
  name: OperationName,
  options?: UseCommandOptions<Payload, Result>
) {
  const variables = options?.variables;
  const queryKey = useQueryKey(name, variables);

  const queryClient = useQueryClient();
  const client = useMusubiClient(options?.musubiContext);

  const query = useMutation<Result, Error, Payload>(
    queryKey,
    async (variables) => {
      return client.command(name, variables, options?.channel);
    },
    {
      ...options,
      onSuccess: async (result, payload) => {
        if (options?.invalidateQueries?.length) {
          await Promise.all(
            options.invalidateQueries.map((q) =>
              queryClient.invalidateQueries(q)
            )
          );
        }

        options?.onSuccess?.({
          payload,
          result,
          queryClient,
          musubiClient: client,
        });
      },
    }
  );

  return {
    ...query,
    key: queryKey,
  } as UseCommandReturn<Payload, Result>;
}
