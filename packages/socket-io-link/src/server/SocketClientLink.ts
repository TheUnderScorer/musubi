import { ClientLink, OperationRequest, OperationResponse } from '@musubi/core';
import { Server } from 'socket.io';
import { Observable } from 'rxjs';
import { createValidatedSocketHandler } from '../shared/handlers';
import { resolveSocketChannel } from './channel';
import { SocketContext } from '../shared/context';
import { SOCKET_MESSAGE_CHANNEL } from '../shared/channel';

export class SocketClientLink implements ClientLink<SocketContext> {
  constructor(private server: Server) {}

  sendRequest<Payload, Result>(
    request: OperationRequest<Payload, SocketContext>
  ): Promise<
    OperationResponse<Result, OperationRequest<Payload, SocketContext>>
  > {
    const channel = resolveSocketChannel(
      this.server,
      request.ctx.socketId,
      request.channel
    );

    if (!('off' in channel)) {
      throw new Error('Broadcast is not supported for this type of request');
    }

    return new Promise((resolve) => {
      const handler = createValidatedSocketHandler(
        OperationResponse.schema,
        (data) => {
          if (data.request?.id === request.id) {
            channel.off('response', handler);

            resolve(OperationResponse.fromObject(data));
          }
        }
      );

      channel.emit(SOCKET_MESSAGE_CHANNEL, request.toJSON());
    });
  }

  subscribeToEvent<Payload>(
    request: OperationRequest<unknown, SocketContext>
  ): Observable<
    OperationResponse<Payload, OperationRequest<unknown, SocketContext>>
  > {
    return new Observable((observer) => {
      const handler = createValidatedSocketHandler(
        OperationResponse.schema,
        (data) => {
          if (data.request?.id === request.id) {
            observer.next(OperationResponse.fromObject(data));
          }
        }
      );

      this.server.on(SOCKET_MESSAGE_CHANNEL, handler);

      return () => {
        this.server.off(SOCKET_MESSAGE_CHANNEL, handler);
      };
    });
  }
}
