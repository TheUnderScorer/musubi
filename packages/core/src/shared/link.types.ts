import { OperationsSchema } from '../schema/schema.types';

export type LinkFn<T> = (params: LinkFnParams) => T;

export type LinkParam<T> = T | LinkFn<T>;

export interface LinkFnParams {
  schema: OperationsSchema;
}
