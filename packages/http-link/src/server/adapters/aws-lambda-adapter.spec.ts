import { startServerless, stopServerless } from './__tests__/aws/serverless';
import { createHttpClientLink } from '../../client/client';
import { pathPrefix } from './__tests__/aws/const';
import { MusubiClient } from '@musubi/core';
import { testSchema } from '../../../../../tools/test/testMusubi';
import { findFreePorts } from 'find-free-ports';

describe('AWS Lambda adapter', () => {
  let link: ReturnType<typeof createHttpClientLink>;

  let client: MusubiClient<typeof testSchema>;

  beforeEach(async () => {
    const [port] = await findFreePorts(1);

    await startServerless(port);

    link = createHttpClientLink({
      url: `http://localhost:${port}`,
      pathPrefix: pathPrefix.client,
    });

    client = new MusubiClient(testSchema, [link]);
  }, 10_000);

  afterEach(() => {
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
