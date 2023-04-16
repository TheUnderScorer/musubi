import {
  OperationName,
  OperationRequest,
  OperationResponse,
  ReceiverLink,
} from '@musubi/core';
import { SocketContext } from '../shared/context';
import { Server } from 'socket.io';
import { Observable } from 'rxjs';
import { SOCKET_MESSAGE_CHANNEL } from '../shared/channel';
import { createValidatedSocketHandler } from '../shared/handlers';
import { resolveSocketChannel } from './channel';

export class SocketReceiverLink implements ReceiverLink<SocketContext> {
  constructor(private server: Server) {}

  receiveRequest(
    name: OperationName
  ): Observable<OperationRequest<unknown, SocketContext>> {
    return new Observable((observer) => {
      const handler = createValidatedSocketHandler(
        OperationRequest.schema,
        (data) => {
          if (data.name === name) {
            observer.next(OperationRequest.fromObject(data));
          }
        }
      );

      this.server.on(SOCKET_MESSAGE_CHANNEL, handler);

      return () => {
        this.server.off(SOCKET_MESSAGE_CHANNEL, handler);
      };
    });
  }

  async sendResponse<Payload, Result>(
    response: OperationResponse<
      Result,
      OperationRequest<Payload, SocketContext>,
      SocketContext
    >
  ): Promise<void> {
    const channel = resolveSocketChannel(
      this.server,
      response.request?.ctx?.socketId,
      response.channel
    );

    channel.emit(SOCKET_MESSAGE_CHANNEL, response);
  }
}
