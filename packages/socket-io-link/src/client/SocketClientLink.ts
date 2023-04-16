import { ClientLink, OperationRequest, OperationResponse } from '@musubi/core';
import { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { SOCKET_MESSAGE_CHANNEL } from '../shared/channel';
import { createValidatedSocketHandler } from '../shared/handlers';

export class SocketClientLink implements ClientLink {
  constructor(private readonly socket: Socket) {}

  sendRequest<Payload, Result>(
    request: OperationRequest<Payload>
  ): Promise<OperationResponse<Result, OperationRequest<Payload>>> {
    return new Promise((resolve) => {
      const handler = createValidatedSocketHandler(
        OperationResponse.schema,
        (data) => {
          if (data.request?.id === request.id) {
            this.socket.off(SOCKET_MESSAGE_CHANNEL, handler);
            resolve(OperationResponse.fromObject(data));
          }
        }
      );

      this.socket.on(SOCKET_MESSAGE_CHANNEL, handler);
      this.socket.emit(SOCKET_MESSAGE_CHANNEL, request.toJSON());
    });
  }

  subscribeToEvent<Payload>(
    request: OperationRequest
  ): Observable<OperationResponse<Payload>> {
    return new Observable((observer) => {
      const handler = createValidatedSocketHandler(
        OperationResponse.schema,
        (data) => {
          if (data.operationName === request.name) {
            observer.next(OperationResponse.fromObject(data));
          }
        }
      );

      this.socket.on(SOCKET_MESSAGE_CHANNEL, handler);

      return () => {
        this.socket.off(SOCKET_MESSAGE_CHANNEL, handler);
      };
    });
  }
}
