import { ClientLink, OperationRequest, OperationResponse } from '@musubi/core';
import { IpcRenderer, IpcRendererEvent } from 'electron';
import { ELECTRON_MESSAGE_CHANNEL } from '../shared/channel';
import { Observable } from 'rxjs';
import { makeResponseHandler } from '../shared/response';
import { ElectronClientContext } from './context';

export class IpcRendererClientLink
  implements ClientLink<ElectronClientContext>
{
  constructor(private readonly ipc: IpcRenderer) {}

  // TODO Check if it is disposed correctly
  subscribeToEvent<Payload>(
    request: OperationRequest<unknown, ElectronClientContext>
  ) {
    return new Observable<
      OperationResponse<
        Payload,
        OperationRequest<unknown, ElectronClientContext>
      >
    >((observer) => {
      const handler = makeResponseHandler<
        IpcRendererEvent,
        unknown,
        Payload,
        ElectronClientContext
      >((event, response) => {
        if (response.operationName === request.name) {
          observer.next(response);
        }
      });

      this.ipc.on(ELECTRON_MESSAGE_CHANNEL, handler);

      return () => {
        this.ipc.off(ELECTRON_MESSAGE_CHANNEL, handler);
      };
    });
  }

  sendRequest<Payload, Result>(
    request: OperationRequest<Payload, ElectronClientContext>
  ): Promise<
    OperationResponse<Result, OperationRequest<Payload, ElectronClientContext>>
  > {
    return new Promise((resolve) => {
      const handler = makeResponseHandler<
        IpcRendererEvent,
        Payload,
        Result,
        ElectronClientContext
      >((event, response) => {
        if (response.request?.id === request.id) {
          this.ipc.off(ELECTRON_MESSAGE_CHANNEL, handler);
          resolve(response);
        }
      });

      this.ipc.on(ELECTRON_MESSAGE_CHANNEL, handler);

      this.ipc.send(ELECTRON_MESSAGE_CHANNEL, request);
    });
  }
}
