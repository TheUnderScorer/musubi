import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MusubiClient, OperationsSchema } from '@musubi/core';
import { createContext, PropsWithChildren, useContext } from 'react';

export interface MusubiProviderProps<
  S extends OperationsSchema = OperationsSchema
> {
  queryClient: QueryClient;
  client: MusubiClient<S>;
  Context?: ReturnType<typeof createMusubiContext>;
}

export interface MusubiContextValue<
  S extends OperationsSchema = OperationsSchema
> {
  client: MusubiClient<S>;
}

export function createMusubiContext() {
  return createContext<MusubiContextValue>({
    client: new MusubiClient({} as OperationsSchema, []),
  });
}

export const DefaultContext = createMusubiContext();

export function useMusubiClient<S extends OperationsSchema>(
  ctx = DefaultContext
) {
  return useContext(ctx).client as MusubiClient<S>;
}

export function MusubiProvider({
  queryClient,
  client,
  children,
  Context = DefaultContext,
}: PropsWithChildren<MusubiProviderProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <Context.Provider value={{ client }}>{children}</Context.Provider>
    </QueryClientProvider>
  );
}
