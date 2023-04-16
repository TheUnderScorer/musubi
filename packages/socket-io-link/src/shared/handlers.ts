import { z } from 'zod';

export const createValidatedSocketHandler =
  <T>(schema: z.Schema<T>, handler: (data: T) => void) =>
  (data: unknown) => {
    const result = schema.safeParse(data);

    if (!result.success) {
      return;
    }

    handler(result.data);
  };
