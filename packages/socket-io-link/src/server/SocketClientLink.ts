import {
  ClientLink,
  Observable,
  OperationRequest,
  OperationResponse,
  OperationsSchema,
} from '@musubi/core';
import { Server } from 'socket.io';
import { createValidatedSocketHandler } from '../shared/handlers';
import { resolveSocketChannel } from './channel';
import { SOCKET_MESSAGE_CHANNEL } from '../shared/channel';
import { SocketServerContext } from './context';
import { PacketObservable } from './packetObservable';

export class SocketClientLink implements ClientLink<SocketServerContext> {
  constructor(
    private server: Server,
    private packet$: PacketObservable,
    private schema: OperationsSchema
  ) {}

  sendRequest<Payload, Result>(
    request: OperationRequest<Payload, SocketServerContext>
  ): Promise<
    OperationResponse<Result, OperationRequest<Payload, SocketServerContext>>
  > {
    const channel = resolveSocketChannel({
      schema: this.schema,
      name: request.name,
      channel: request.channel,
      ctx: request.ctx,
      server: this.server,
      payload: request.payload,
      socketId: request.ctx?.socketId,
    });

    if (!('off' in channel)) {
      throw new Error('Broadcast is not supported for this type of request');
    }

    return new Promise((resolve) => {
      const handler = createValidatedSocketHandler(
        OperationResponse.schema,
        (data) => {
          if (data.request?.id === request.id) {
            channel.off(SOCKET_MESSAGE_CHANNEL, handler);

            resolve(OperationResponse.fromObject(data));
          }
        }
      );

      channel.emit(SOCKET_MESSAGE_CHANNEL, request.toJSON());
      channel.on(SOCKET_MESSAGE_CHANNEL, handler);
    });
  }

  subscribeToEvent<Payload>(
    request: OperationRequest<unknown, SocketServerContext>
  ): Observable<
    OperationResponse<
      Payload,
      OperationRequest<unknown, SocketServerContext>,
      SocketServerContext
    >
  > {
    return this.packet$
      .map((data) => ({
        ...data,
        payload: OperationResponse.schema.safeParse(data.payload),
      }))
      .filter(
        (result) =>
          result.payload.success &&
          result.payload.data.operationName === request.name
      )
      .map((data) => {
        if (!data.payload.success) {
          throw new Error();
        }

        return OperationResponse.fromObject(
          data.payload.data
        ).addCtx<SocketServerContext>({
          socketId: {
            value: data.socket.id,
            isSerializable: true,
          },
          socket: {
            value: data.socket,
            isSerializable: false,
          },
        }) as OperationResponse<
          Payload,
          OperationRequest<unknown, SocketServerContext>,
          SocketServerContext
        >;
      });
  }
}
