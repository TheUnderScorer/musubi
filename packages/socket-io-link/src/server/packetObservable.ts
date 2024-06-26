import { Server, Socket } from 'socket.io';
import {
  SOCKET_MESSAGE_CHANNEL,
  toSocketSpecificChannel,
} from '../shared/channel';
import { Observable } from '@musubi/core';

export type PacketObservable = ReturnType<typeof createPacketObservable>;

export function createPacketObservable(server: Server) {
  const observable = new Observable<{
    payload: unknown;
    socket: Socket;
  }>();

  server.on('connection', (socket) => {
    socket.join(toSocketSpecificChannel(socket.id));

    socket.use((packet, next) => {
      const [name, payload] = packet;

      if (name === SOCKET_MESSAGE_CHANNEL) {
        observable.next({
          payload,
          socket,
        });
      }

      next();
    });
  });

  return observable;
}
