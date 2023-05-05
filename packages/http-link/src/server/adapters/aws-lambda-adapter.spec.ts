import { startServerless, stopServerless } from './__tests__/aws/serverless';
import { createHttpClientLink } from '../../client/client';
import { pathPrefix } from './__tests__/aws/const';
import { MusubiClient } from '@musubi/core';
import { testSchema } from '../../../../../tools/test/testMusubi';

describe('AWS Lambda adapter', () => {
  const link = createHttpClientLink({
    url: 'http://localhost:3001',
    pathPrefix: pathPrefix.client,
  });

  const client = new MusubiClient(testSchema, [link]);

  beforeAll(async () => {
    await startServerless();
  });

  afterAll(() => {
    stopServerless();
  });

  it('should receive queries and commands', async () => {
    const user = await client.command('createUser', { name: 'John' });

    expect(user.name).toEqual('John');

    const userFromQuery = await client.query('getUser', {
      id: user.id,
    });

    expect(userFromQuery).toEqual(user);
  }, 15_000);
});
