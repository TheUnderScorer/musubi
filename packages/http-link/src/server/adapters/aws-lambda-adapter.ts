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
import { LinkParam, OperationRequest } from '@musubi/core';
import { HttpServerReceiverLink } from '../HttpServerReceiverLink';

export interface AwsLambdaContext {
  event: APIGatewayProxyEvent;
  context: Context;
}

class AwsLambdaAdapter implements MusubiServerAdapter {
  protected readonly response$ = new Subject<
    APIGatewayProxyStructuredResultV2 & { event: APIGatewayProxyEvent }
  >();

  protected readonly newRequest$ = new Subject<AwsLambdaContext>();

  observePath(
    path: string,
    method: MusubiHttpMethod
  ): Observable<MusubiHttpRequest> {
    return this.newRequest$.pipe(
      filter(({ event }) => event.path === path && event.httpMethod === method),
      map(({ event, context }) => {
        const method = event.httpMethod.toUpperCase() as MusubiHttpMethod;

        const requestSource =
          method === MusubiHttpMethod.GET
            ? event.queryStringParameters
            : JSON.parse(event.body ?? '');

        const musubiRequest = OperationRequest.fromUnsafeObject(requestSource);

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
          headers: event.headers as MusubiHttpHeaders,
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
        };
      })
    );
  }

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

      return firstValueFrom(response$);
    };
  }
}

/***/
export function createAwsLambdaHttpLink() {
  const adapter = new AwsLambdaAdapter();
  const link: LinkParam<HttpServerReceiverLink> = ({ schema }) =>
    new HttpServerReceiverLink(adapter, schema);

  return {
    link,
    getHandler: () => adapter.toHandler(),
  };
}
