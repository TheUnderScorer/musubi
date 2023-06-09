/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { Server } from 'socket.io';
import { toSocketSpecificChannel } from '../shared/channel';
import {
  ExtractPayload,
  getOperationFromSchema,
  OperationDefinition,
  OperationName,
  OperationsSchema,
} from '@musubi/core';
import { SocketServerContext } from './context';

export interface GetChannelParams<
  Definition extends OperationDefinition<any, any, any> = OperationDefinition,
  Ctx extends SocketServerContext = SocketServerContext
> {
  payload: ExtractPayload<Definition>;
  ctx: Ctx;
  server: Server;
}

export interface ServerSocketOperationMeta<
  Definition extends OperationDefinition = OperationDefinition,
  Ctx extends SocketServerContext = SocketServerContext
> {
  /**
   * Returns channel that will be used for this operation.
   *
   * When sending message from server, it will determine to which channel the message will be sent.
   * For events - it will determine to which channel the event will be sent.
   *
   * Note: When sending messages from client, this function will NOT be called, because it will always be returned to socket from which the message was sent.
   */
  getChannel?: (
    params: GetChannelParams<Definition, Ctx>
  ) => SocketServerChannel;
}

export const defineServerSocketMeta =
  <Definition extends OperationDefinition<any, any, any, any, any>>(
    meta: ServerSocketOperationMeta<Definition>
  ) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_: Definition) =>
    meta;

export type SocketServerChannel = z.infer<typeof socketServerChannelSchema>;
export const socketServerChannelSchema = z.union([
  z.object({
    roomId: z.string().optional(),
    isBroadcast: z.literal(false).optional(),
    socketId: z.string().optional(),
  }),
  z.object({
    roomId: z.string().optional(),
    isBroadcast: z.literal(true),
    socketId: z.string(),
  }),
]);

interface ResolveSocketChannelParams {
  schema: OperationsSchema;
  name: OperationName;
  payload: any;
  ctx: SocketServerContext;
  server: Server;
  channel?: any;
  socketId?: string;
}

export function resolveSocketChannel({
  schema,
  name,
  payload,
  ctx,
  server,
  ...params
}: ResolveSocketChannelParams) {
  const operation = getOperationFromSchema(schema, name);

  let channel = {
    ...params.channel,
  };

  let resolvedFromMeta = false;

  if (!params.channel) {
    channel = (operation.meta as ServerSocketOperationMeta)?.getChannel?.({
      ctx,
      payload,
      server,
    });

    resolvedFromMeta = true;
  }

  if (
    typeof channel === 'object' &&
    !channel.socketId &&
    params.socketId &&
    !resolvedFromMeta
  ) {
    channel.socketId = params.socketId;
  }

  const parsedChannel = socketServerChannelSchema.safeParse(channel);

  if (!parsedChannel.success) {
    return server;
  }

  const { roomId, isBroadcast, socketId } = parsedChannel.data;

  const socket = socketId ? server.sockets.sockets.get(socketId) : undefined;

  if (isBroadcast) {
    if (!socket) {
      throw new Error(`Socket with id ${socketId} not found`);
    }

    const broadcast = socket.broadcast;

    return roomId ? broadcast.to(roomId) : broadcast;
  }

  if (roomId) {
    const room = server.to(roomId);

    return socketId ? room.to(toSocketSpecificChannel(socketId)) : room;
  }

  return socket ?? server;
}
