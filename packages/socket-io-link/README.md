

<div style="text-align: center;width:100%">
<h1>
Musubi 🪢
</h1>
<strong>End-to-end typesafe communication. 🎉</strong>
</div>

# @musubi/socket-io-link

Adapter for using Musubi with socket.io.

## Documentation
Full documentation for `musubi` can be found [here](https://github.com/TheUnderScorer/musubi).

## Installation
```shell
# npm
npm install @musubi/socket-io-link

# Yarn
yarn add @musubi/socket-io-link
```

## Usage

```ts
// Server
import { createSocketIoServerLink } from '@musubi/socket-io-link/server';
import { createMusubi } from '@musubi/core';
import { schema } from '../schema';
import { Server} from 'socket.io';

async function main() {
  const server = new Server();
  
  const link = createSocketIoServerLink(server);
  const { receiver, client } = createMusubi({
    schema,
    clientLinks: [link.client],
    receiverLinks: [link.receiver],
  });

  receiver.handleQuery('ping', async (_, ctx) => {
    // Access client socket
    console.log(ctx.socket);
    
    // Send message to all clients
    // Note: It will always return void for now
    await client.query('pong')
    
    // Send query to sockets in specific room
    await client.query('pong', {
      roomId: 'room1',
    })
    
    // Send query to specific socket
    await client.query('pong', {
      socketId: ctx.socketId
    })
    
    // Send query to all sockets except the current one
    await client.query('pong', {
      socketId: ctx.socketId,
      isBroadcast: true,
    })
    
    // Above examples work for
    
    return 'pong'
  });
}

main().catch(console.error);
```

```ts
// Client
import { createSocketIoClientLink } from '@musubi/socket-io-link/client';
import { createMusubi } from '@musubi/core';
import { schema } from '../schema';
import io from 'socket.io-client';

async function main() {
  const socketClient = io('http://localhost:3000', {
    autoConnect: false,
  });
  
  const link = createSocketIoClientLink(socketClient);

  const { receiver, client } = createMusubi({
    schema,
    clientLinks: [link.client],
    receiverLinks: [link.receiver],
  });

  const result = await client.query('ping');
  console.log(result); // pong
}

```
