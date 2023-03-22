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
import { Observable, Subject } from 'rxjs';

export class CommunicatorClient<S extends OperationsSchema> {
  constructor(
    private readonly schema: S,
    private readonly links: ClientLink[]
  ) {}

  async query<Name extends keyof S['queries']>(
    name: Name,
    payload: ExtractPayload<S['queries'][Name]>
  ): Promise<ExtractResult<S['queries'][Name]>> {
    return this.sendOperation(
      name as OperationName,
      payload,
      OperationKind.Query
    );
  }

  command<Name extends keyof S['commands']>(
    name: Name,
    payload: ExtractPayload<S['commands'][Name]>
  ): Promise<ExtractResult<S['commands'][Name]>> {
    return this.sendOperation(
      name as OperationName,
      payload,
      OperationKind.Command
    );
  }

  observeEvent<Name extends keyof S['events']>(name: Name) {
    const request = new OperationRequest(
      name as OperationName,
      OperationKind.Event,
      {}
    );

    const rootNext = new Subject<
      OperationResponse<ExtractPayload<S['events'][Name]>>
    >();

    const observable = this.links.reduceRight<
      Observable<OperationResponse<ExtractPayload<S['events'][Name]>>>
    >((next, link) => {
      return link.subscribeToEvent(request, next);
    }, rootNext.asObservable());

    return new Observable<ExtractPayload<S['events'][Name]>>((observer) => {
      observable.subscribe((event) => {
        try {
          // TODO Validate
          observer.next(event.unwrap());
        } catch (error) {
          observer.error(error);
        }
      });
    });
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

    const handler = this.links.reduceRight(
      (next, link) => async () =>
        link.sendRequest<Payload, Result>(request, next),
      rootNext
    );

    const response = await handler(request).catch((error) =>
      OperationResponse.fromError(request.name, request.kind, error, request)
    );

    return response.unwrap() as Result;
  }
}
