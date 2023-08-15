import { LinkPair } from '@musubi/core';
import { SocketClientLink } from './SocketClientLink';
import { SocketReceiverLink } from './SocketReceiverLink';
import { Server } from 'socket.io';
import { createPacketObservable } from './packetObservable';

export function createSocketIoServerLink(
  server: Server
): LinkPair<SocketClientLink, SocketReceiverLink> {
  const packet$ = createPacketObservable(server);

  return {
    client: ({ schema }) => new SocketClientLink(server, packet$, schema),
    receiver: ({ schema }) => new SocketReceiverLink(server, packet$, schema),
  };
}

export * from '../shared/channel';
