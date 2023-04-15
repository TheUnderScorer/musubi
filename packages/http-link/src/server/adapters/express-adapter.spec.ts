import { createHttpClientLink } from '../../client/client';
import { MusubiClient, MusubiReceiver } from '@musubi/core';
import {
  setupTestUserHandlers,
  testSchema,
} from '../../../../../tools/test/testMusubi';
import express, { Application } from 'express';
import { ServerContext } from '../server.types';
import { createExpressHttpLink } from './express-adapter';
import * as http from 'http';

const port = 8080;

const clientLink = createHttpClientLink({
  url: `http://localhost:${port}`,
  headers: {
    'Content-Type': 'application/json',
  },
  fetch: globalThis.fetch,
});
const client = new MusubiClient(testSchema, [clientLink]);

let app: Application;
let receiver: MusubiReceiver<typeof testSchema, ServerContext>;
let server: http.Server;

let requests: {
  url: string;
  body?: unknown;
  method: string;
  searchParams?: URLSearchParams;
}[];

describe('Express adapter', () => {
  beforeEach(() => {
    requests = [];

    app = express();

    app.use(express.json());

    app.use((req, res, next) => {
      requests.push({
        url: req.url,
        searchParams: new URLSearchParams(req.url.split('?')[1]),
        body: req.body,
        method: req.method,
      });

      next();
    });

    return new Promise<void>((resolve) => {
      server = app.listen(port, () => {
        receiver = new MusubiReceiver(testSchema, [createExpressHttpLink(app)]);

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
  });
});
