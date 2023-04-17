import { Server, Socket } from 'socket.io';
import { Subject } from 'rxjs';
import {
  SOCKET_MESSAGE_CHANNEL,
  toSocketSpecificChannel,
} from '../shared/channel';

export type PacketObservable = ReturnType<typeof createPacketObservable>;

export function createPacketObservable(server: Server) {
  const subject = new Subject<{
    payload: unknown;
    socket: Socket;
  }>();

  server.on('connection', (socket) => {
    socket.join(toSocketSpecificChannel(socket.id));

    socket.use((packet, next) => {
      const [name, payload] = packet;

      if (name === SOCKET_MESSAGE_CHANNEL) {
        subject.next({
          payload,
          socket,
        });
      }

      next();
    });
  });

  return subject.asObservable();
}
