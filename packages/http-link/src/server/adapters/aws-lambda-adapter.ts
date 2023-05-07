import { MusubiServerAdapter, ObserverPathResult } from '../server.types';
import {
  MusubiHttpHeaders,
  MusubiHttpMethod,
  MusubiHttpRequest,
} from '../../shared/http.types';
import { filter, map, Observable, Subject } from 'rxjs';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';
import { LinkParam, OperationResponse, wait } from '@musubi/core';
import { HttpServerReceiverLink } from '../HttpServerReceiverLink';
import { parseMusubiHttpRequest } from '../http';
import { SharedHttpOptions } from '../../shared/options.types';
import { resolveKindForMethod } from '../../shared/http';
import { getOperationFromPath } from '../../shared/routing';

export interface AwsLambdaContext<Format extends LambdaApiFormat> {
  event: LambdaRequestPayloadMap[Format];
  context: Context;
}

export enum LambdaApiFormat {
  v1 = 'v1',
  v2 = 'v2',
}

type LambdaRequestParser<Event> = (
  event: Event
) => Omit<MusubiHttpRequest, 'reply'>;

type LambdaRequestParsers = {
  [Key in LambdaApiFormat]: LambdaRequestParser<LambdaRequestPayloadMap[Key]>;
};

export type LambdaRequestPayloadMap = {
  [LambdaApiFormat.v1]: APIGatewayProxyEvent;
  [LambdaApiFormat.v2]: APIGatewayProxyEventV2;
};

const requestParsers: LambdaRequestParsers = {
  [LambdaApiFormat.v1]: (event) => {
    return {
      method: event.httpMethod.toUpperCase() as MusubiHttpMethod,
      headers: event.headers as MusubiHttpHeaders,
      body: event.body ? JSON.parse(event.body) : {},
      path: event.path,
      queryParams: event.queryStringParameters ?? {},
    };
  },
  [LambdaApiFormat.v2]: (event) => {
    return {
      method:
        event.requestContext.http.method.toUpperCase() as MusubiHttpMethod,
      headers: event.headers as MusubiHttpHeaders,
      path: event.rawPath,
      body: event.body ? JSON.parse(event.body) : {},
      queryParams: event.queryStringParameters ?? {},
    };
  },
};

export interface AwsLambdaAdapterOptions<Format extends LambdaApiFormat> {
  timeoutMs?: number;
  format: Format;
}

class AwsLambdaAdapter<Format extends LambdaApiFormat>
  implements MusubiServerAdapter
{
  protected readonly newRequest$ = new Subject<{
    request: MusubiHttpRequest;
    event: LambdaRequestPayloadMap[Format];
    context: Context;
  }>();

  constructor(
    protected readonly options: AwsLambdaAdapterOptions<Format> &
      SharedHttpOptions
  ) {}

  protected get timeout() {
    return this.options?.timeoutMs ?? 3000;
  }

  observePath(
    path: string,
    method: MusubiHttpMethod
  ): Observable<ObserverPathResult> {
    return this.newRequest$.pipe(
      filter(
        ({ request }) => request.path === path && request.method === method
      ),
      map(({ event, context, request }) => {
        const operationRequest = parseMusubiHttpRequest(request);

        operationRequest.addCtx<AwsLambdaContext<Format>>({
          context: {
            value: context,
            isSerializable: false,
          },
          event: {
            value: event,
            isSerializable: false,
          },
        });

        return {
          httpRequest: request,
          operationRequest,
        };
      })
    ) as Observable<ObserverPathResult>;
  }

  /**
   * Returns AWS Lambda function handler that should be exported from function file
   * */
  toHandler() {
    return (
      event: LambdaRequestPayloadMap[Format],
      context: Context
    ): Promise<APIGatewayProxyStructuredResultV2> => {
      const parser = requestParsers[this.options.format];
      const rawRequest = parser(event);

      const requestPromise = new Promise<APIGatewayProxyStructuredResultV2>(
        (resolve) => {
          const request: MusubiHttpRequest = {
            ...rawRequest,
            reply: ({ status, response }) => {
              resolve({
                body: JSON.stringify(response),
                statusCode: status,
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            },
          };

          this.newRequest$.next({
            request,
            event,
            context,
          });
        }
      );

      return Promise.race([
        requestPromise,
        wait(this.timeout).then(() => {
          const response = OperationResponse.fromError(
            getOperationFromPath(rawRequest.path, this.options.pathPrefix),
            resolveKindForMethod(rawRequest.method),
            {
              message: 'Timeout waiting for response from server.',
            },
            null
          );

          return {
            body: JSON.stringify(response.toJSON()),
            statusCode: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          } satisfies APIGatewayProxyStructuredResultV2;
        }),
      ]);
    };
  }
}

/***/
export function createAwsLambdaHttpLink<Format extends LambdaApiFormat>(
  options: SharedHttpOptions & AwsLambdaAdapterOptions<Format>
) {
  const adapter = new AwsLambdaAdapter(options);
  const link: LinkParam<HttpServerReceiverLink> = ({ schema }) =>
    new HttpServerReceiverLink(adapter, schema, options);

  return {
    link,
    /**
     * Returns AWS Lambda function handler that should be exported from function file
     *
     * @example
     *
     * ```typescript
     * import { createAwsLambdaHttpLink } from '../../aws-lambda-adapter';
     * import { MusubiReceiver } from '@musubi/core';
     * import { testSchema } from '../../../../../../../tools/test/testMusubi';
     * import { pathPrefix } from './const';
     *
     * const { link, getHandler } = createAwsLambdaHttpLink({
     *   pathPrefix: pathPrefix.server,
     *   timeoutMs: 15_000,
     * });
     *
     * const receiver = new MusubiReceiver(testSchema, [link]);
     *
     * export const handler = getHandler();
     * ```
     * */
    getHandler: () => adapter.toHandler(),
  };
}
