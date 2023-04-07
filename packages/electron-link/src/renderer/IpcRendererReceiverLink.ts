import {
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { Observable } from 'rxjs';
import { makeRequestHandler } from '../shared/request';
import { IpcRenderer, IpcRendererEvent } from 'electron';
import { ELECTRON_MESSAGE_CHANNEL } from '../shared/channel';
import { ElectronClientContext } from './context';

export class IpcRendererReceiverLink
  implements ReceiverLink<ElectronClientContext>
{
  constructor(private readonly ipc: IpcRenderer) {}

  receiveRequest(
    name: OperationName
  ): Observable<OperationRequest<unknown, ElectronClientContext>> {
    return new Observable((observer) => {
      const handler = makeRequestHandler<
        IpcRendererEvent,
        unknown,
        ElectronClientContext
      >((event, request) => {
        if (request.name === name) {
          observer.next(request);
        }
      });

      this.ipc.on(ELECTRON_MESSAGE_CHANNEL, handler);

      return () => {
        this.ipc.off(ELECTRON_MESSAGE_CHANNEL, handler);
      };
    });
  }

  async sendResponse<Payload, Result>(
    response: OperationResponse<
      Result,
      OperationRequest<Payload, ElectronClientContext>
    >
  ) {
    await this.ipc.send(ELECTRON_MESSAGE_CHANNEL, response);
  }
}
