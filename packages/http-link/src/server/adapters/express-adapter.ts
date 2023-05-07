import { Application } from 'express';
import { MusubiServerAdapter, ObserverPathResult } from '../server.types';
import {
  MusubiHttpHeaders,
  MusubiHttpMethod,
  MusubiHttpRequest,
} from '../../shared/http.types';
import { Observable } from 'rxjs';
import { LinkParam } from '@musubi/core';
import { HttpServerReceiverLink } from '../HttpServerReceiverLink';
import { SharedHttpOptions } from '../../shared/options.types';
import { parseMusubiHttpRequest } from '../http';

class ExpressAdapter implements MusubiServerAdapter {
  constructor(private app: Application) {}

  observePath(
    path: string,
    method: MusubiHttpMethod
  ): Observable<ObserverPathResult> {
    const httpMethod = method.toLowerCase() as Lowercase<MusubiHttpMethod>;

    return new Observable((observer) => {
      this.app[httpMethod](path, (req, res) => {
        const request: MusubiHttpRequest = {
          method,
          headers: req.headers as MusubiHttpHeaders,
          queryParams: req.query,
          path: req.path,
          body: req.body,
          reply: ({ response, status }) => {
            res.status(status).json(response);
          },
        };

        observer.next({
          operationRequest: parseMusubiHttpRequest(request),
          httpRequest: request,
        });
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
