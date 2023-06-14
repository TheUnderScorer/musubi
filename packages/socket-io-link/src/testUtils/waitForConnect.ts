import { Socket } from 'socket.io-client';
import { wait } from 'nx-cloud/lib/utilities/waiter';

export async function waitForConnect(client: Socket) {
  while (!client.connected) {
    await wait(100);
  }
}
