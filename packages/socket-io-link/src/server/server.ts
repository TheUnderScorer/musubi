import { LinkPair } from '@musubi/core';
import { SocketClientLink } from './SocketClientLink';
import { SocketReceiverLink } from './SocketReceiverLink';
import { Server } from 'socket.io';

export function createSocketIoServerLink(
  server: Server
): LinkPair<SocketClientLink, SocketReceiverLink> {
  return {
    client: new SocketClientLink(server),
    receiver: new SocketReceiverLink(server),
  };
}
