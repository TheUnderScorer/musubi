import { Socket } from 'socket.io-client';
import { wait } from '@musubi/core';

export async function waitForConnect(client: Socket) {
  while (!client.connected) {
    await wait(100);
  }
}
