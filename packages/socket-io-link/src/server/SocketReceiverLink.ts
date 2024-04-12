import {
  Observable,
  OperationKind,
  OperationName,
  OperationRequest,
  OperationResponse,
  OperationsSchema,
  ReceiverLink,
} from '@musubi/core';
import { Server } from 'socket.io';
import { SOCKET_MESSAGE_CHANNEL } from '../shared/channel';
import { resolveSocketChannel } from './channel';
import { PacketObservable } from './packetObservable';
import { SocketServerContext } from './context';

export class SocketReceiverLink implements ReceiverLink<SocketServerContext> {
  constructor(
    private server: Server,
    private packet$: PacketObservable,
    private schema: OperationsSchema
  ) {}

  receiveRequest(
    name: OperationName
  ): Observable<OperationRequest<unknown, SocketServerContext>> {
    return this.packet$
      .lift()
      .map((v) => ({
        ...v,
        payload: OperationRequest.schema.safeParse(v.payload),
      }))
      .filter((v) => v.payload.success && v.payload.data.name === name)
      .map((v) => {
        if (!v.payload.success) {
          // Should NOT happen, just for correct types :D
          throw new Error();
        }

        const request = OperationRequest.fromObject(v.payload.data);

        return request.addCtx<SocketServerContext>({
          socketId: {
            value: v.socket.id,
            isSerializable: true,
          },
          socket: {
            value: v.socket,
            isSerializable: false,
          },
        });
      });
  }

  async sendResponse<Payload, Result>(
    response: OperationResponse<
      Result,
      OperationRequest<Payload, SocketServerContext>,
      SocketServerContext
    >
  ): Promise<void> {
    if (response.operationKind !== OperationKind.Event) {
      if (!response.ctx.socket) {
        throw new Error('Cannot send response without socket');
      }

      response.ctx.socket.emit(SOCKET_MESSAGE_CHANNEL, response.toJSON());
    } else {
      const channel = resolveSocketChannel({
        channel: response.channel,
        ctx: response.ctx,
        payload:
          response.operationKind === OperationKind.Event
            ? response.result
            : response.request?.payload,
        schema: this.schema,
        server: this.server,
        name: response.operationName,
      });

      channel.emit(SOCKET_MESSAGE_CHANNEL, response.toJSON());
    }
  }
}
