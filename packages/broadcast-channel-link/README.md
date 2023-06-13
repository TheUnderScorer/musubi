

<div style="text-align: center;width:100%">
<h1>
Musubi 🪢
</h1>
<strong>End-to-end typesafe communication. 🎉</strong>
</div>

# @musubi/broadcast-channel-link

Adapter for using Musubi in browser extension.

## Documentation
Full documentation for `musubi` can be found [here](https://github.com/TheUnderScorer/musubi).

## Installation
```shell
# npm
npm install @musubi/broadcast-channel-link

# Yarn
yarn add @musubi/broadcast-channel-link
```

## Usage

```ts
// Service worker/shared worker script
import { createBroadcastChannelLink } from '@musubi/broadcast-channel-link';
import { MusubiReceiver } from '@musubi/core';
import { schema } from '../schema';

const channel = new BroadcastChannel('musubi');

async function main() {
  const link = createBroadcastChannelLink(channel);
  const receiver = new MusubiReceiver(schema, [
    link.receiver,
  ]);

  receiver.handleQuery('ping', async () => {
    return 'pong';
  });
}

main().catch(console.error);
```

```ts
// Inside your app
import { createBroadcastChannelLink } from '@musubi/broadcast-channel-link';
import { schema } from '../schema';

const channel = new BroadcastChannel('musubi');

const worker = new SharedWorker('worker.js');
// or if browser doesn't support SharedWorker
// const worker = new Worker('worker.js');

const link = createBroadcastChannelLink(channel);

// If you are using Worker, you can pass it into link instead of channel
// const link = createBroadcastChannelLink(worker);

const client = new MusubiClient(schema, [
  link.client,
]);

await client.query('ping') // 'pong'
```
