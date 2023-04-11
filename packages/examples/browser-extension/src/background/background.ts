import { createBrowserExtensionLink } from '@musubi/browser-extension-link';
import { CommunicatorReceiver } from '@musubi/core';
import { browserExtensionSchema } from '../schema';
import * as browser from 'webextension-polyfill';

async function main() {
  const link = createBrowserExtensionLink('background');
  const receiver = new CommunicatorReceiver(browserExtensionSchema, [
    link.receiver,
  ]);

  receiver.handleCommand('closeRightTab', async (_, ctx) => {
    if (!ctx.senderTabId) {
      throw new Error('No sender tab id');
    }

    const tabs = await browser.tabs.query({});

    const tab = tabs.find((tab) => tab.id === ctx.senderTabId);

    if (!tab) {
      return;
    }

    const tabIndex = tabs.indexOf(tab);

    const nextTab = tabs[tabIndex + 1];

    if (nextTab?.id) {
      await browser.tabs.remove(nextTab.id);
    }
  });

  receiver.handleQuery('getAllTabIds', async () => {
    const tabs = await browser.tabs.query({});

    console.log('getAllTabIds', { tabs });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return tabs.map((tab) => tab.id!);
  });

  console.info('background script ready');
}

main().catch(console.error);
