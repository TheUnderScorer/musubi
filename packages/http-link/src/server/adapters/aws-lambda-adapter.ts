import { MusubiServerAdapter } from '../server.types';
import {
  MusubiHttpHeaders,
  MusubiHttpMethod,
  MusubiHttpRequest,
} from '../../shared/http.types';
import { filter, firstValueFrom, map, Observable, Subject } from 'rxjs';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';
import {
  LinkParam,
  OperationRequest,
  OperationResponse,
  wait,
} from '@musubi/core';
import { HttpServerReceiverLink } from '../HttpServerReceiverLink';
import { extractRequestDataFromGetRequest, querySchema } from '../http';
import { SharedHttpOptions } from '../../shared/options.types';
import { resolveKindForMethod } from '../../shared/http';

export interface AwsLambdaContext {
  event: APIGatewayProxyEvent;
  context: Context;
}

export interface AwsLambdaAdapterOptions {
  timeoutMs?: number;
}

class AwsLambdaAdapter implements MusubiServerAdapter {
  protected readonly response$ = new Subject<
    APIGatewayProxyStructuredResultV2 & { event: APIGatewayProxyEvent }
  >();

  protected readonly newRequest$ = new Subject<AwsLambdaContext>();

  constructor(protected readonly options?: AwsLambdaAdapterOptions) {}

  protected get timeout() {
    return this.options?.timeoutMs ?? 3000;
  }

  protected parseMethodAndHeaders(event: APIGatewayProxyEvent) {
    const method = event.httpMethod.toUpperCase() as MusubiHttpMethod;
    const headers = event.headers as MusubiHttpHeaders;

    return { method, headers };
  }

  protected extractMusubiRequest(event: APIGatewayProxyEvent) {
    const { method, headers } = this.parseMethodAndHeaders(event);

    const requestProperties =
      method === MusubiHttpMethod.GET
        ? extractRequestDataFromGetRequest(
            querySchema.parse(event.queryStringParameters).input ?? '',
            headers
          )
        : JSON.parse(event.body ?? '');

    return {
      request: OperationRequest.fromUnsafeObject(requestProperties),
      method,
      headers,
    };
  }

  observePath(
    path: string,
    method: MusubiHttpMethod
  ): Observable<MusubiHttpRequest> {
    return this.newRequest$.pipe(
      filter(({ event }) => event.path === path && event.httpMethod === method),
      map(({ event, context }) => {
        let data: ReturnType<typeof this.extractMusubiRequest> | undefined;

        try {
          data = this.extractMusubiRequest(event);
        } catch (error) {
          const { method } = this.parseMethodAndHeaders(event);

          const response = OperationResponse.fromError(
            'unknownOp',
            resolveKindForMethod(method),
            error,
            null
          );

          this.response$.next({
            event,
            body: JSON.stringify(response.toJSON()),
            statusCode: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          });

          return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { method, headers, request: musubiRequest } = data!;

        musubiRequest.addCtx<AwsLambdaContext>({
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
          method,
          headers,
          payload: musubiRequest,
          reply: (response, status) => {
            this.response$.next({
              event,
              body: JSON.stringify(response),
              statusCode: status,
              headers: {
                'Content-Type': 'application/json',
              },
            });
          },
        } as MusubiHttpRequest;
      }),
      filter((v) => Boolean(v))
    ) as Observable<MusubiHttpRequest>;
  }

  /**
   * Returns AWS Lambda function handler that should be exported from function file
   * */
  toHandler() {
    return (
      event: APIGatewayProxyEvent,
      context: Context
    ): Promise<APIGatewayProxyStructuredResultV2> => {
      const response$ = this.response$.pipe(
        filter((response) => response.event === event),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        map(({ event: _event, ...res }) => res)
      );

      this.newRequest$.next({ event, context });

      return Promise.race([
        firstValueFrom(response$),
        wait(this.timeout).then(() => {
          const { method } = this.parseMethodAndHeaders(event);

          const response = OperationResponse.fromError(
            'UNKNOWN',
            resolveKindForMethod(method),
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
          } as APIGatewayProxyStructuredResultV2;
        }),
      ]);
    };
  }
}

/***/
export function createAwsLambdaHttpLink(
  options?: SharedHttpOptions & AwsLambdaAdapterOptions
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
