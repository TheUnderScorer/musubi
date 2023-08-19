import { ClientLink, OperationRequest, OperationResponse } from '@musubi/core';
import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { ELECTRON_MESSAGE_CHANNEL } from '../shared/channel';
import { getWindowFromChannel } from './getWindowFromChannel';
import { Observable } from 'rxjs';
import { makeResponseHandler } from '../shared/response';
import { ElectronMainContext } from './context';
import { sendMessageToAllWindows, sendMessageToWindow } from './send';
import { ElectronWindows } from './ElectronWindows';

export class IpcMainClientLink implements ClientLink<ElectronMainContext> {
  constructor(
    private readonly ipc: IpcMain,
    private readonly windows: ElectronWindows
  ) {}

  subscribeToEvent<Payload>(
    request: OperationRequest<unknown, ElectronMainContext>
  ): Observable<
    OperationResponse<Payload, OperationRequest<unknown, ElectronMainContext>>
  > {
    return new Observable((observer) => {
      const handler = makeResponseHandler<
        IpcMainInvokeEvent,
        unknown,
        Payload,
        ElectronMainContext
      >((event, response) => {
        const window = getWindowFromChannel(request.channel);

        if (
          response.operationName === request.name &&
          (!window || window.webContents.id === event.sender.id)
        ) {
          response.addCtx<ElectronMainContext>({
            event: {
              value: event,
              isSerializable: false,
            },
          });

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
    request: OperationRequest<Payload, ElectronMainContext>
  ): Promise<
    OperationResponse<Result, OperationRequest<Payload, ElectronMainContext>>
  > {
    return new Promise((resolve) => {
      // TODO Reject when window is closed?
      const window = getWindowFromChannel(request.channel);

      const handler = makeResponseHandler<
        IpcMainInvokeEvent,
        Payload,
        Result,
        ElectronMainContext
      >((_event, response) => {
        if (response.request?.id === request.id) {
          this.ipc.off(ELECTRON_MESSAGE_CHANNEL, handler);
          resolve(response);
        }
      });

      this.ipc.on(ELECTRON_MESSAGE_CHANNEL, handler);

      const payload = request.toJSON();

      if (window) {
        sendMessageToWindow(window, payload);
      } else {
        sendMessageToAllWindows(payload, this.windows.windows);
      }
    });
  }
}
