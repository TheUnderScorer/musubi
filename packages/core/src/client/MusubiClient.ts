import {
  ExtractPayload,
  ExtractResult,
  OperationKind,
  OperationName,
  OperationsSchema,
  OptionalPayload,
} from '../schema/schema.types';
import {
  ClientLink,
  OperationEvent,
  SendRequestFn,
  SubscribeToEventFn,
} from './client.types';
import { OperationRequest } from '../shared/OperationRequest';
import { Channel } from '../shared/communication.types';
import { OperationResponse } from '../shared/OperationResponse';
import { validatePayload, validateResult } from '../schema/validation';
import { LinkParam } from '../shared/link.types';
import { createLinks } from '../shared/link';
import { Chain } from '../chain/Chain';
import { Observable } from '../observable/Observable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MusubiClient<S extends OperationsSchema, Ctx = any> {
  private readonly links: ClientLink<Ctx>[];

  constructor(private readonly schema: S, links: LinkParam<ClientLink<Ctx>>[]) {
    this.links = createLinks(links, schema);
  }

  cloneWithLinks(modifier: (links: ClientLink<Ctx>[]) => ClientLink<Ctx>[]) {
    return new MusubiClient(this.schema, modifier(this.links));
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

    const chain = new Chain<SubscribeToEventFn<Ctx>>();

    for (const link of this.links) {
      if (link.subscribeToEvent) {
        chain.use(link.subscribeToEvent.bind(link));
      }
    }

    return chain.exec(request).map((event) => ({
      payload: validatePayload(
        this.schema,
        OperationKind.Event,
        event.operationName,
        event.unwrap()
      ),
      ctx: event.ctx as Ctx,
    }));
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

    const chain = new Chain<SendRequestFn<Ctx>>();

    for (const link of this.links) {
      if (link.sendRequest) {
        chain.use(link.sendRequest.bind(link));
      }
    }

    chain.use(() => {
      throw new Error('No link handled the request');
    });

    const response = await chain
      .exec(request)
      .catch((error) =>
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
