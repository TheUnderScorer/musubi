

<div style="text-align: center;width:100%">
<h1>
Musubi 🪢
</h1>
<strong>End-to-end typesafe communication. 🎉</strong>
</div>

# @musubi/browser-extension-link

Adapter for using Musubi in browser extension.

## Documentation
Full documentation for `musubi` can be found [here](https://github.com/TheUnderScorer/musubi).

## Installation
```shell
# npm
npm install @musubi/browser-extension-link

# Yarn
yarn add @musubi/browser-extension-link
```

## Usage

```ts
// Background/service worker script
import { createBrowserExtensionLink } from '@musubi/browser-extension-link';
import { MusubiReceiver } from '@musubi/core';
import { schema } from '../schema';
import * as browser from 'webextension-polyfill';

async function main() {
  const link = createBrowserExtensionLink('background');
  const receiver = new MusubiReceiver(schema, [
    link.receiver,
  ]);

  receiver.handleQuery('getTabs', async () => {
    return browser.tabs.query({});
  });

  console.info('background script ready');
}

main().catch(console.error);


```
