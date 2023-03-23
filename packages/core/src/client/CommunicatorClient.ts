import {
  ExtractPayload,
  ExtractResult,
  OperationKind,
  OperationName,
} from '../schema/schema.types';
import { ClientLink } from './client.types';
import { OperationRequest } from '../shared/OperationRequest';
import { Channel } from '../shared/communication.types';
import { OperationResponse } from '../shared/OperationResponse';
import { OperationsSchema } from '../schema/OperationsSchema';
import { map, Observable, Subject, tap } from 'rxjs';
import { isSubscription } from 'rxjs/internal/Subscription';

// TODO Channels support
export class CommunicatorClient<S extends OperationsSchema> {
  constructor(
    private readonly schema: S,
    private readonly links: ClientLink[]
  ) {}

  async query<Name extends keyof S['queries']>(
    name: Name,
    payload: ExtractPayload<S['queries'][Name]>,
    channel?: Channel
  ): Promise<ExtractResult<S['queries'][Name]>> {
    return this.sendOperation(
      name as OperationName,
      payload,
      OperationKind.Query,
      channel
    );
  }

  async command<Name extends keyof S['commands']>(
    name: Name,
    payload: ExtractPayload<S['commands'][Name]>,
    channel?: Channel
  ): Promise<ExtractResult<S['commands'][Name]>> {
    return this.sendOperation(
      name as OperationName,
      payload,
      OperationKind.Command,
      channel
    );
  }

  /**
   * TODO Mention that is should have only one subscription
   * */
  observeEvent<Name extends keyof S['events']>(name: Name, channel?: Channel) {
    const request = new OperationRequest(
      name as OperationName,
      OperationKind.Event,
      {},
      channel
    );

    const rootNext = new Subject<
      OperationResponse<ExtractPayload<S['events'][Name]>>
    >();

    const observable = this.links
      .filter((link) => link.subscribeToEvent)
      .reduceRight<
        Observable<OperationResponse<ExtractPayload<S['events'][Name]>>>
      >((next, link) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const result = link.subscribeToEvent!(request, next);

        if (isSubscription(result)) {
          return next.pipe(
            tap({
              finalize: () => {
                result.unsubscribe();
              },
            })
          );
        }

        return result;
      }, rootNext.asObservable());

    return observable.pipe(map((event) => event.unwrap())).pipe(
      tap({
        finalize: () => {
          rootNext.complete();
        },
      })
    );
  }

  private async sendOperation<Name extends OperationName, Payload, Result>(
    name: Name,
    payload: Payload,
    kind: OperationKind,
    channel?: Channel
  ): Promise<Result> {
    const request = new OperationRequest(name, kind, payload, channel);

    const rootNext = async (request: OperationRequest<Payload>) => {
      return OperationResponse.fromError<Result, typeof request>(
        request.name,
        request.kind,
        new Error('No link handled the request'),
        request
      );
    };

    const handler = this.links
      .filter((link) => link.sendRequest)
      .reduceRight(
        (next, link) => async () =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          link.sendRequest!<Payload, Result>(request, next),
        rootNext
      );

    const response = await handler(request).catch((error) =>
      OperationResponse.fromError(request.name, request.kind, error, request)
    );

    return response.unwrap() as Result;
  }
}
