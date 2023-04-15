

<div style="text-align: center;width:100%">
<h1>
Musubi 🪢
</h1>
<strong>End-to-end typesafe communication. 🎉</strong>
</div>

# @musubi/core

## Documentation
Full documentation for `@musubi/core` can be found [here](https://github.com/TheUnderScorer/musubi).

## Installation
```shell
# npm
npm install @musubi/core

# Yarn
yarn add @musubi/core
```

## Usage
```ts
import { defineSchema, CommunicatorClient } from "@musubi/core";
import { createHttpClientLink } from "@musubi/http-link";
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

async function main() {
  const httpLink = createHttpClientLink({
    url: "http://localhost:3000/api"
  });
  const client = new CommunicatorClient(schema, [httpLink]);

  // Querying the greeting
  const response = await client.query("greet", {
    name: "John"
  });

  console.log("response", response); // Hello John
}

```
