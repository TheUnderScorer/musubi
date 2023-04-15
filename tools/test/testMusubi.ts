import {
  createMusubi,
  mergeSchemas,
  MusubiReceiver,
} from '../../packages/core/src';
import { z } from 'zod';
import { createTestLink } from './testLink';
import { testPostSchema, testUserSchema, User } from './testSchemas';

export const testSchema = mergeSchemas(testUserSchema, testPostSchema);

export function setupTestUserHandlers(
  receiver: MusubiReceiver<typeof testUserSchema>
) {
  const users: Array<z.infer<typeof User>> = [];

  receiver.handleCommand('createUser', async (payload) => {
    const user = {
      id: Math.random().toString(),
      name: payload.name,
    };

    users.push(user);

    await receiver.dispatchEvent('userCreated', user);

    return user;
  });

  receiver.handleQuery('getUser', async (payload) => {
    return users.find((user) => user.id === payload.id);
  });

  return { users };
}

export function createTestMusubi() {
  const link = createTestLink();
  const musubi = createMusubi({
    schema: testSchema,
    clientLinks: [link.clientLink],
    receiverLinks: [link.receiverLink],
  });

  const { users } = setupTestUserHandlers(musubi.receiver);

  return {
    musubi,
    link,
    users,
  };
}
