import { ClientLink, OperationRequest, OperationResponse } from '@musubi/core';
import { BrowserWindow, IpcMain, IpcMainInvokeEvent } from 'electron';
import { ELECTRON_MESSAGE_CHANNEL } from '../shared/channel';
import { getWindowProviderFromChannel } from './getWindowProviderFromChannel';
import { Observable } from 'rxjs';
import { makeResponseHandler } from '../shared/response';
import { ElectronMainContext } from './context';

export class IpcMainClientLink implements ClientLink<ElectronMainContext> {
  constructor(private readonly ipc: IpcMain) {}

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
        const window = getWindowProviderFromChannel(request.channel).get();

        if (
          response.operationName === request.name &&
          (!window || window.webContents.id === event.sender.id)
        ) {
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
      const window = getWindowProviderFromChannel(request.channel).get();

      const handler = makeResponseHandler<
        IpcMainInvokeEvent,
        Payload,
        Result,
        ElectronMainContext
      >((event, response) => {
        if (response.request?.id === request.id) {
          this.ipc.off(ELECTRON_MESSAGE_CHANNEL, handler);
          resolve(response);
        }
      });

      this.ipc.handle(ELECTRON_MESSAGE_CHANNEL, handler);

      if (window) {
        window.webContents.send(ELECTRON_MESSAGE_CHANNEL, request);
      } else {
        // TODO Aggregate responses?
        BrowserWindow.getAllWindows().forEach((window) => {
          window.webContents.send(ELECTRON_MESSAGE_CHANNEL, request);
        });
      }
    });
  }
}
