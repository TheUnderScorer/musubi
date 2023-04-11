import {
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { BrowserWindow, IpcMain, IpcMainInvokeEvent } from 'electron';
import { Observable } from 'rxjs';
import { ELECTRON_MESSAGE_CHANNEL } from '../shared/channel';
import { getWindowProviderFromChannel } from './getWindowProviderFromChannel';
import { makeRequestHandler } from '../shared/request';
import { ElectronMainContext } from './context';

export class IpcMainReceiverLink implements ReceiverLink<ElectronMainContext> {
  constructor(private readonly ipc: IpcMain) {}

  async sendResponse<Payload, Result>(
    response: OperationResponse<Result, OperationRequest<Payload>>
  ) {
    const window = getWindowProviderFromChannel(response.channel).get();

    const payload = response.toJSON();

    if (window) {
      window.webContents.send(ELECTRON_MESSAGE_CHANNEL, payload);

      return;
    }

    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(ELECTRON_MESSAGE_CHANNEL, payload);
    });
  }

  receiveRequest(
    name: OperationName
  ): Observable<OperationRequest<unknown, ElectronMainContext>> {
    return new Observable((observer) => {
      const handler = makeRequestHandler<
        IpcMainInvokeEvent,
        unknown,
        ElectronMainContext
      >((event, request) => {
        const window = BrowserWindow.fromWebContents(event.sender);

        if (
          (request.name === name && !request.channel) ||
          request.channel === window?.id
        ) {
          request.addCtx({
            event: {
              value: event,
              isSerializable: false,
            },
          });
          observer.next(request);
        }
      });

      this.ipc.on(ELECTRON_MESSAGE_CHANNEL, handler);

      return () => {
        this.ipc.off(ELECTRON_MESSAGE_CHANNEL, handler);
      };
    });
  }
}
