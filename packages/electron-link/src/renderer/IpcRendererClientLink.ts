import {
  ClientLink,
  Observable,
  OperationRequest,
  OperationResponse,
  Subscription,
} from '@musubi/core';
import { IpcRendererEvent } from 'electron';
import { makeResponseHandler } from '../shared/response';
import { ElectronClientContext } from './context';
import { ExposedMusubiLink } from '../shared/expose';

export class IpcRendererClientLink
  implements ClientLink<ElectronClientContext>
{
  constructor(private readonly ipc: ExposedMusubiLink) {}

  // TODO Check if it is disposed correctly
  subscribeToEvent<Payload>(
    request: OperationRequest<unknown, ElectronClientContext>
  ) {
    return new Observable<
      OperationResponse<
        Payload,
        OperationRequest<unknown, ElectronClientContext>,
        ElectronClientContext
      >
    >((observer) => {
      const handler = makeResponseHandler<
        IpcRendererEvent,
        unknown,
        Payload,
        ElectronClientContext
      >((event, response) => {
        if (response.operationName === request.name) {
          observer.next(
            response as OperationResponse<
              Payload,
              OperationRequest<unknown, ElectronClientContext>,
              ElectronClientContext
            >
          );
        }
      });

      return new Subscription(this.ipc.receive(handler)).add(() => {
        observer.complete();
      });
    });
  }

  sendRequest<Payload, Result>(
    request: OperationRequest<Payload, ElectronClientContext>
  ): Promise<
    OperationResponse<Result, OperationRequest<Payload, ElectronClientContext>>
  > {
    return new Promise((resolve) => {
      // eslint-disable-next-line prefer-const
      let subscription: Subscription | undefined;

      const handler = makeResponseHandler<
        IpcRendererEvent,
        Payload,
        Result,
        ElectronClientContext
      >((event, response) => {
        if (response.request?.id === request.id) {
          subscription?.unsubscribe?.();
          resolve(response);
        }
      });

      subscription = new Subscription(this.ipc.receive(handler));

      this.ipc.send(request.toJSON());
    });
  }
}
