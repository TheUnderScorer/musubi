

<div style="text-align: center;width:100%">
<h1>
Musubi 🪢
</h1>
<strong>End-to-end typesafe communication. 🎉</strong>
</div>

# @musubi/react

Wrapper for using Musubi in React. It uses [react-query](https://react-query.tanstack.com/) under the hood.

## Installation
```shell
# npm
npm install @musubi/react

# Yarn
yarn add @musubi/react
```

## Documentation
Full documentation for `musubi` can be found [here](https://github.com/TheUnderScorer/musubi).

## Usage
1. Wrap your application in provider

```tsx
// index.tsx
import { schema } from "./schema";
import { QueryClient } from "@tanstack/react-query";
import { MusubiClient } from "@musubi/core";
import { createInMemoryLink } from "@musubi/in-memory-link";
import { App } from './App';
import { MusubiProvider } from "@musubi/react";

// Example with in memory link, but it could be any link
const link = createInMemoryLink()

const queryClient = new QueryClient();
const client = new MusubiClient(schema, [link.client]);

const m = createReactMusubi(testSchema);

function MyApp() {
  return (
    <MusubiProvider queryClient={queryClient} client={client}>
      <App />
    </MusubiProvider>
  )
}
```
2. Initialize react hooks
```tsx
// schema.ts
import { createReactMusubi } from "@musubi/react";
import { defineSchema, query } from "@musubi/core";
import { z } from "zod";

export const schema = defineSchema({
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

export const m = createReactMusubi(schema);
```

3. Use operations inside your components 🎉
```tsx
// App.tsx
import { m } from "./schema";

export function App() {
  const { data, isLoading } = m.greet.useQuery("greet", { name: "John" });

  return (
    <div>
      {isLoading ? "Loading..." : data}
    </div>
  )
}
```
