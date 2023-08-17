import {
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { BrowserWindow, IpcMain, IpcMainInvokeEvent } from 'electron';
import { Observable } from 'rxjs';
import { ELECTRON_MESSAGE_CHANNEL } from '../shared/channel';
import { getWindowFromChannel } from './getWindowFromChannel';
import { makeRequestHandler } from '../shared/request';
import { ElectronMainContext } from './context';
import { sendMessageToAllWindows, sendMessageToWindow } from './send';

export class IpcMainReceiverLink implements ReceiverLink<ElectronMainContext> {
  constructor(private readonly ipc: IpcMain) {}

  async sendResponse<Payload, Result>(
    response: OperationResponse<Result, OperationRequest<Payload>>
  ) {
    const window = getWindowFromChannel(response.channel);

    const payload = response.toJSON();

    if (window) {
      sendMessageToWindow(window, payload);

      return;
    }

    sendMessageToAllWindows(payload);
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
