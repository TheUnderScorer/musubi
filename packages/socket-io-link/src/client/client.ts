import { Socket } from 'socket.io-client';
import { LinkPair } from '@musubi/core';
import { SocketClientLink } from './SocketClientLink';
import { SocketReceiverLink } from './SocketReceiverLink';

export function createSocketIoClientLink(
  socket: Socket
): LinkPair<SocketClientLink, SocketReceiverLink> {
  return {
    client: new SocketClientLink(socket),
    receiver: new SocketReceiverLink(socket),
  };
}

export * from '../shared/channel';
