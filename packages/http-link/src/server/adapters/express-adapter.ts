import { Application } from 'express';
import { MusubiServerAdapter } from '../server.types';
import {
  MusubiHttpHeaders,
  MusubiHttpMethod,
  MusubiHttpRequest,
} from '../../shared/http.types';
import { Observable } from 'rxjs';
import { LinkParam } from '@musubi/core';
import { HttpServerReceiverLink } from '../HttpServerReceiverLink';
import { extractRequestDataFromGetRequest, querySchema } from '../http';
import { SharedHttpOptions } from '../../shared/options.types';

class ExpressAdapter implements MusubiServerAdapter {
  constructor(private app: Application) {}

  observePath(
    path: string,
    method: MusubiHttpMethod
  ): Observable<MusubiHttpRequest> {
    const httpMethod = method.toLowerCase() as Lowercase<MusubiHttpMethod>;

    return new Observable((observer) => {
      this.app[httpMethod](path, (req, res) => {
        const payload =
          method === MusubiHttpMethod.GET
            ? extractRequestDataFromGetRequest(
                querySchema.parse(req.query).input,
                req.headers as MusubiHttpHeaders
              )
            : req.body;

        const request: MusubiHttpRequest = {
          method,
          headers: req.headers as MusubiHttpHeaders,
          payload,
          reply: (response, status) => {
            res.status(status).json(response);
          },
        };

        observer.next(request);
      });
    });
  }
}

/**
 * Creates a link that can be used with the MusubiReceiver to handle requests in express app.
 *
 * Note: it doesn't support subscriptions, for that you need to use socket.io adapter.
 *
 * @example
 * ```ts
 * import { createExpressHttpLink } from '@musubi/http-link';
 * import express from 'express';
 * import { schema } from './schema';
 * import { MusubiReceiver } from '@musubi/core';
 *
 * const app = express();
 * app.use(express.json());
 *
 * const link = createExpressHttpLink(app);
 *
 * const receiver = new MusubiReceiver(schema, link);
 *
 * receiver.handleQuery(...);
 * ```
 * */
export function createExpressHttpLink(
  app: Application,
  options?: SharedHttpOptions
): LinkParam<HttpServerReceiverLink> {
  return ({ schema }) =>
    new HttpServerReceiverLink(new ExpressAdapter(app), schema, options);
}
