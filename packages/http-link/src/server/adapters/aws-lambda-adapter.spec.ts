import { startServerless, stopServerless } from './__tests__/aws/serverless';
import { createHttpClientLink } from '../../client/client';
import { lambdaPaths } from './__tests__/aws/const';
import { MusubiClient } from '@musubi/core';
import { testSchema } from '../../../../../tools/test/testMusubi';
import { findFreePorts } from 'find-free-ports';
import { LambdaApiFormat } from './aws-lambda-adapter';

describe('AWS Lambda adapter', () => {
  let link: ReturnType<typeof createHttpClientLink>;
  let port: number;

  let client: MusubiClient<typeof testSchema>;

  beforeEach(async () => {
    [port] = await findFreePorts(1);

    await startServerless(port);
  }, 10_000);

  afterEach(() => {
    stopServerless();
  });

  Object.values(LambdaApiFormat).forEach((format) => {
    describe(format, () => {
      beforeEach(() => {
        link = createHttpClientLink({
          url: `http://localhost:${port}`,
          pathPrefix: lambdaPaths[format].client,
        });

        client = new MusubiClient(testSchema, [link]);
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
  });
});
