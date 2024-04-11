import {
  Observable,
  OperationKind,
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { Socket } from 'socket.io-client';
import { createValidatedSocketHandler } from '../shared/handlers';
import { SOCKET_MESSAGE_CHANNEL } from '../shared/channel';
import { SocketContext } from '../shared/context';

export class SocketReceiverLink implements ReceiverLink<SocketContext> {
  constructor(private readonly socket: Socket) {}

  private get socketId() {
    return this.socket.id;
  }

  receiveRequest(
    name: OperationName
  ): Observable<OperationRequest<unknown, SocketContext>> {
    return new Observable((observer) => {
      const handler = createValidatedSocketHandler(
        OperationRequest.schema,
        (data) => {
          if (data.name === name) {
            const request = OperationRequest.fromObject(
              data
            ).addCtx<SocketContext>({
              socketId: {
                value: this.socketId,
                isSerializable: true,
              },
            });
            observer.next(request);
          }
        }
      );

      this.socket.on(SOCKET_MESSAGE_CHANNEL, handler);

      return () => {
        this.socket.off(SOCKET_MESSAGE_CHANNEL, handler);
      };
    });
  }

  async sendResponse<Payload, Result>(
    response: OperationResponse<Result, OperationRequest<Payload>, unknown>
  ): Promise<void> {
    if (response.operationKind === OperationKind.Event) {
      response.addCtx<SocketContext>({
        socketId: {
          value: this.socketId,
          isSerializable: true,
        },
      });
    }

    this.socket.emit(SOCKET_MESSAGE_CHANNEL, response.toJSON());
  }
}
