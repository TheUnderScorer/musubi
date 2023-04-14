import { useMemo } from 'react';

export function useQueryKey(
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: any
) {
  return useMemo(
    () => (variables ? [query, variables] : [query]),
    [query, variables]
  );
}
