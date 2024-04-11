import { createHttpClientLink } from '../../client/client';
import {
  defineSchema,
  mergeSchemas,
  MusubiClient,
  MusubiReceiver,
  operation,
} from '@musubi/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  setupTestUserHandlers,
  testSchema,
} from '../../../../../tools/test/testMusubi';
import express, { Application, Request } from 'express';
import { ServerContext } from '../server.types';
import { createExpressHttpLink } from './express-adapter';
import * as http from 'http';
import { findFreePorts } from 'find-free-ports';
import { z } from 'zod';

const expressTestSchema = mergeSchemas(
  testSchema,
  defineSchema({
    events: {},
    queries: {
      testQueryWithArray: operation.query
        .withPayload(
          z.object({
            arrayStr: z.array(z.string()),
            arrayNum: z.array(z.coerce.number()),
            arrayObj: z.array(
              z.object({
                num: z.coerce.number(),
                str: z.string(),
                bool: z.coerce.boolean(),
              })
            ),
            string: z.string(),
          })
        )
        .withResult(z.literal('ok')),
    },
    commands: {
      testStatusCode: operation.command,
    },
  })
);

let clientLink: ReturnType<typeof createHttpClientLink>;

let client: MusubiClient<typeof expressTestSchema>;

let app: Application;
let receiver: MusubiReceiver<typeof expressTestSchema, ServerContext>;
let server: http.Server;

let requests: {
  url: string;
  body?: unknown;
  method: string;
  searchParams?: URLSearchParams;
  headers: Request['headers'];
  response: {
    status: () => number;
  };
}[];

describe('Express adapter', () => {
  beforeEach(async () => {
    jest.resetAllMocks();

    requests = [];

    app = express();

    const [port] = await findFreePorts(1);

    clientLink = createHttpClientLink({
      url: `http://localhost:${port}`,
      headers: {
        'Content-Type': 'application/json',
      },
      fetch: globalThis.fetch,
    });

    client = new MusubiClient(expressTestSchema, [clientLink]);

    app.use(express.json());

    app.use((req, res, next) => {
      next();

      requests.push({
        url: req.url,
        searchParams: new URLSearchParams(req.url.split('?')[1]),
        body: req.body,
        method: req.method,
        headers: req.headers,
        response: {
          status: () => res.statusCode,
        },
      });
    });

    return new Promise<void>((resolve) => {
      server = app.listen(port, () => {
        receiver = new MusubiReceiver(expressTestSchema, [
          createExpressHttpLink(app),
        ]);

        setupTestUserHandlers(receiver);

        resolve();
      });
    });
  });

  afterEach(() => {
    return new Promise<void>((resolve, reject) => {
      server?.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  });

  it('should receive queries and commands', async () => {
    const now = Date.now();

    jest.spyOn(Date, 'now').mockReturnValue(now);

    const commandResult = await client.command('createUser', {
      name: 'John',
    });

    expect(commandResult.name).toBe('John');

    const [request] = requests;
    expect(request.url).toEqual('/api/musubi/createUser');
    expect(request.method).toEqual('POST');

    const user = await client.query('getUser', {
      id: commandResult.id,
    });

    const [, secondRequest] = requests;

    expect(secondRequest.searchParams?.get('payload.id')).toEqual(
      commandResult.id
    );

    expect(secondRequest.searchParams?.get('timestamp')).toEqual(
      now.toString()
    );
    expect(secondRequest.searchParams?.get('ctx')).toEqual('{}');

    expect(user).toEqual(commandResult);
    expect(secondRequest.url).toContain('/api/musubi/getUser');
    expect(secondRequest.method).toEqual('GET');
  });

  it('should support queries with array payload', async () => {
    receiver.handleQuery(
      'testQueryWithArray',
      ({ string, arrayNum, arrayStr, arrayObj }) => {
        expect(string).toEqual('string');
        expect(arrayNum).toEqual([1, 2, 3]);
        expect(arrayStr).toEqual(['1', '2', '3']);
        expect(arrayObj[0]).toEqual({
          num: 1,
          str: 'str',
          bool: true,
        });

        return 'ok';
      }
    );

    const response = await client.query('testQueryWithArray', {
      string: 'string',
      arrayStr: ['1', '2', '3'],
      arrayNum: [1, 2, 3],
      arrayObj: [
        {
          num: 1,
          str: 'str',
          bool: true,
        },
      ],
    });

    expect(response).toEqual('ok');

    const [request] = requests;

    expect(request).toBeTruthy();
  });

  it('should support setting status code via ctx', async () => {
    receiver.handleCommand('testStatusCode', (_, ctx) => {
      ctx.responseStatusCode = 404;
    });

    await client.command('testStatusCode');

    const [request] = requests;
    expect(request.url).toEqual('/api/musubi/testStatusCode');
    expect(request.method).toEqual('POST');
    expect(request.response.status()).toEqual(404);
  });
});
