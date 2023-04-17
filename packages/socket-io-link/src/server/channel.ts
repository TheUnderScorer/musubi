import { z } from 'zod';
import { Server } from 'socket.io';
import { toSocketSpecificChannel } from '../shared/channel';

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

export function resolveSocketChannel(
  server: Server,
  _socketId?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _channel?: any
) {
  const channel = {
    ..._channel,
  };

  if (typeof channel === 'object' && !channel.socketId && _socketId) {
    channel.socketId = _socketId;
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
