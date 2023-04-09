

<div style="text-align: center;width:100%">
<h1>
Musubi 🪢
</h1>
<strong>End-to-end typesafe communication. 🎉</strong>
</div>

# @musubi/electron-link

Adapter for using Musubi in electron apps.

## Documentation
Full documentation for `musubi` can be found [here](https://github.com/TheUnderScorer/musubi).

## Installation
```shell
# npm
npm install @musubi/electron-link

# Yarn
yarn add @musubi/electron-link
```

## Basic setup

1. Initialize your electron app
```typescript
import { app } from "electron";
import { createMainLink } from "@musubi/electron-link/main";
import { cr } from "@musubi/electron-link/main";
import { schema } from "./schema";

app.on("ready", () => {
  const electronLink = createMainLink();

  const { receiver, client } = createMusubi({
    schema,
    clientLinks: [electronLink.client],
    receiverLinks: [electronLink.receiver]
  });

  const win = new BrowserWindow({
    webPreferences: {
      // Replace this path with the path to your preload file (more in next step)
      preload: "path/to/preload.js"
    }
  });

  receiver.handleCommand(...);
  receiver.handleQuery(...);
  
  
  // Send query to specific window, by passing it's ID as last parementer.
  // It works with commands and events as well
  client.query('testQuery', {test: true}, win.id)
});
```
> Note: By omitting `channel` parameter, message will be sent to all windows, but you will always get `void` as result

2. Expose the IPC to the render process from the preload file:
```typescript
import { exposeElectronLink } from '@musubi/electron-link/main';

exposeElectronLink();
```
3. Create a client in the renderer process:
```typescript
import { createRendererLink } from "@musubi/electron-link/renderer";
import { electronSchema } from "./schema";
import { createMusubi } from "@musubi/core";

const link = createRendererLink();

const { receiver, client } = createMusubi({
  clientLinks: [link.client],
  receiverLinks: [link.receiver],
  schema: electronSchema
});

// Send query to main process
client.query(...);

// Send command to main process
client.command(...);

// Handle query from main process
receiver.handleQuery(...);

// Handle command from main process
receiver.handleCommand(...);

// Dispatch even to main process
receiver.dispatchEvent();
```
4. Done! 🎉
