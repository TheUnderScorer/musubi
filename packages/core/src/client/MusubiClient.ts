import {
  ExtractPayload,
  ExtractResult,
  OperationKind,
  OperationName,
  OperationsSchema,
  OptionalPayload,
} from '../schema/schema.types';
import { ClientLink, OperationEvent } from './client.types';
import { OperationRequest } from '../shared/OperationRequest';
import { Channel } from '../shared/communication.types';
import { OperationResponse } from '../shared/OperationResponse';
import { map, Observable, Subject, tap } from 'rxjs';
import { isSubscription } from 'rxjs/internal/Subscription';
import { validatePayload, validateResult } from '../schema/validation';
import { LinkParam } from '../shared/link.types';
import { createLinks } from '../shared/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MusubiClient<S extends OperationsSchema, Ctx = any> {
  private links: ClientLink<Ctx>[];

  constructor(private readonly schema: S, links: LinkParam<ClientLink<Ctx>>[]) {
    this.links = createLinks(links, schema);
  }

  /**
   * Executes query from schema
   *
   * @example ```
   *  const result = await client.query('getUsers', { filter: { name: 'John' } })
   * ```
   *
   * */
  async query<Name extends keyof S['queries']>(
    name: Name,
    ...params: OptionalPayload<ExtractPayload<S['queries'][Name]>> extends true
      ? [payload?: ExtractPayload<S['queries'][Name]>, channel?: Channel]
      : [payload: ExtractPayload<S['queries'][Name]>, channel?: Channel]
  ): Promise<ExtractResult<S['queries'][Name]>> {
    const [payload, channel] = params;

    return this.sendOperation(
      name as OperationName,
      payload,
      OperationKind.Query,
      channel
    );
  }

  /**
   * Executes command from schema
   *
   * @example ```
   * const result = await client.command('createUser', { name: 'John' })
   * ```
   *
   * */
  async command<Name extends keyof S['commands']>(
    name: Name,
    ...params: OptionalPayload<ExtractPayload<S['commands'][Name]>> extends true
      ? [payload?: ExtractPayload<S['commands'][Name]>, channel?: Channel]
      : [payload: ExtractPayload<S['commands'][Name]>, channel?: Channel]
  ): Promise<ExtractResult<S['commands'][Name]>> {
    const [payload, channel] = params;
    return this.sendOperation(
      name as OperationName,
      payload,
      OperationKind.Command,
      channel
    );
  }

  /**
   * Creates observer for given event
   *
   * @example ```
   * const observer = client.observeEvent('userCreated')
   *
   * observer.subscribe((event) => {
   *    console.log(event.payload)
   * })
   * ```
   * */
  observeEvent<Name extends keyof S['events']>(
    name: Name,
    channel?: Channel
  ): Observable<OperationEvent<ExtractPayload<S['events'][Name]>, Ctx>> {
    const request = new OperationRequest<unknown, Ctx>(
      name as OperationName,
      OperationKind.Event,
      {},
      channel
    );

    const rootNext = new Subject<
      OperationResponse<
        ExtractPayload<S['events'][Name]>,
        OperationRequest<unknown, Ctx>
      >
    >();

    const observable = this.links
      .filter((link) => link.subscribeToEvent)
      .reduceRight<
        Observable<
          OperationResponse<
            ExtractPayload<S['events'][Name]>,
            OperationRequest<unknown, Ctx>
          >
        >
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

        return result as Observable<
          OperationResponse<
            ExtractPayload<S['events'][Name]>,
            OperationRequest<unknown, Ctx>
          >
        >;
      }, rootNext.asObservable());

    return observable
      .pipe(
        map((event) => ({
          payload: validatePayload(
            this.schema,
            OperationKind.Event,
            event.operationName,
            event.unwrap()
          ),
          ctx: event.ctx as Ctx,
        }))
      )
      .pipe(
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
    const request = new OperationRequest<Payload, Ctx>(
      name,
      kind,
      validatePayload(this.schema, kind, name, payload),
      channel
    );

    const rootNext = async (request: OperationRequest<Payload, Ctx>) => {
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

    return validateResult<S, Result>(
      this.schema,
      kind,
      name,
      response.unwrap() as Result
    );
  }
}
