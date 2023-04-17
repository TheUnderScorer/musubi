export const SOCKET_MESSAGE_CHANNEL = 'musubi-socket-message';

export type SocketSpecificChannel = `musubi-socket#${string}`;

export function toSocketSpecificChannel(socketId: string) {
  return `musubi-socket#${socketId}` as SocketSpecificChannel;
}
