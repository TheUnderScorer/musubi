import {
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { Observable, Subscription } from 'rxjs';
import { makeRequestHandler } from '../shared/request';
import { IpcRendererEvent } from 'electron';
import { ElectronClientContext } from './context';
import { ExposedMusubiLink } from '../shared/expose';

export class IpcRendererReceiverLink
  implements ReceiverLink<ElectronClientContext>
{
  constructor(private readonly ipc: ExposedMusubiLink) {}

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

      return new Subscription(this.ipc.receive(handler)).add(() => {
        observer.complete();
      });
    });
  }

  async sendResponse<Payload, Result>(
    response: OperationResponse<
      Result,
      OperationRequest<Payload, ElectronClientContext>
    >
  ) {
    const payload = response.toJSON();

    await this.ipc.send(payload);
  }
}
