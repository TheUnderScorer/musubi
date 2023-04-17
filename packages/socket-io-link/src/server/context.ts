import { SocketContext } from '../shared/context';
import { Socket } from 'socket.io';

export interface SocketServerContext extends SocketContext {
  socket: Socket;
}
