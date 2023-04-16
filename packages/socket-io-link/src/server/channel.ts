import { z } from 'zod';
import { Server } from 'socket.io';

export type SocketServerChannel = z.infer<typeof socketServerChannelSchema>;
export const socketServerChannelSchema = z.object({
  roomId: z.string().optional(),
  isBroadcast: z.boolean().optional(),
});

export function resolveSocketChannel(
  server: Server,
  socketId?: string,
  channel?: unknown
) {
  const parsedChannel = socketServerChannelSchema.safeParse(channel);

  if (!parsedChannel.success) {
    return server;
  }

  const { roomId, isBroadcast } = parsedChannel.data;

  if (roomId) {
    if (isBroadcast) {
      if (!socketId) {
        throw new Error('Socket id is required to emit broadcast');
      }

      const socket = server.sockets.sockets.get(socketId);

      if (!socket) {
        throw new Error(`Socket with id ${socketId} not found`);
      }

      return socket.broadcast.to(roomId);
    }

    return server.to(roomId);
  }

  return server;
}
