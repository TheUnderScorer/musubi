import { createHttpClientLink } from '../../client/client';
import {
  defineSchema,
  mergeSchemas,
  MusubiClient,
  MusubiReceiver,
  operation,
} from '@musubi/core';
import {
  setupTestUserHandlers,
  testSchema,
} from '../../../../../tools/test/testMusubi';
import express, { Application, Request } from 'express';
import { ServerContext } from '../server.types';
import { createExpressHttpLink } from './express-adapter';
import * as http from 'http';
import { MusubiHeaders } from '../../shared/http';

const port = 8080;

const expressTestSchema = mergeSchemas(
  testSchema,
  defineSchema({
    events: {},
    queries: {},
    commands: {
      testStatusCode: operation.command,
    },
  })
);

const clientLink = createHttpClientLink({
  url: `http://localhost:${port}`,
  headers: {
    'Content-Type': 'application/json',
  },
  fetch: globalThis.fetch,
});
const client = new MusubiClient(expressTestSchema, [clientLink]);

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
  beforeEach(() => {
    jest.resetAllMocks();

    requests = [];

    app = express();

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

    expect(user).toEqual(commandResult);
    expect(secondRequest.url).toContain('/api/musubi/getUser?input=');
    expect(secondRequest.method).toEqual('GET');
    expect(secondRequest.headers[MusubiHeaders.X_MUSUBI_ID]).toBeTruthy();
    expect(secondRequest.headers[MusubiHeaders.X_MUSUBI_CTX]).toEqual('{}');
    expect(secondRequest.headers[MusubiHeaders.X_MUSUBI_TIMESTAMP]).toEqual(
      now.toString()
    );
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
