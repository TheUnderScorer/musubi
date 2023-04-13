

<div style="text-align: center;width:100%">
<h1>
Musubi 🪢
</h1>
<strong>End-to-end typesafe communication. 🎉</strong>
</div>

# @musubi/in-memory-link

Adapter for using Musubi with in-memory communication.

## Documentation
Full documentation for `musubi` can be found [here](https://github.com/TheUnderScorer/musubi).

## Installation
```shell
# npm
npm install @musubi/in-memory-link

# Yarn
yarn add @musubi/in-memory-link
```

## Usage
```ts
import { defineSchema, CommunicatorClient, MusubiReceiver } from "@musubi/core";
import { createInMemoryLink } from "@musubi/in-memory-link";
import { z } from "zod";

const schema = defineSchema({
  queries: {
    greet: query()
      .withPayload(
        z.object({
          name: z.string()
        })
      )
      .withResult(z.string())
  }
});

const memoryLink = createInMemoryLink();

const receiver = new MusubiReceiver(schema, [memoryLink.receiver]);

receiver.handleQuery('greet', payload => `Hello ${payload.name}`);

async function main() {
  const client = new CommunicatorClient(schema, [memoryLink.client]);

  // Querying the greeting
  const response = await client.query("greet", {
    name: "John"
  });

  console.log("response", response); // Hello John
}

```
