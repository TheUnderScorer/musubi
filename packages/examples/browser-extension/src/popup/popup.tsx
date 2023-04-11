import {
  browserExtensionChannel,
  createBrowserExtensionLink,
} from '@musubi/browser-extension-link';
import { CommunicatorClient } from '@musubi/core';
import { browserExtensionSchema, defaultChannels } from '../schema';

async function main() {
  const link = createBrowserExtensionLink('popup', defaultChannels);

  const client = new CommunicatorClient(browserExtensionSchema, [link.client]);

  const elements = {
    result: document.getElementById('result') as HTMLDivElement,
    getTabIds: document.getElementById('get_tab_ids') as HTMLButtonElement,
    replaceContents: document.getElementById(
      'replace_contents'
    ) as HTMLButtonElement,
  };

  client.observeEvent('contentReplaced').subscribe(() => {
    console.log('contentReplaced');

    elements.result.textContent = 'Content replaced!';
  });

  elements.replaceContents.addEventListener('click', async () => {
    await client.command('replaceContent', {
      content: 'Hello from popup!',
    });
  });

  elements.getTabIds.addEventListener('click', async () => {
    const result = await client.query(
      'getAllTabIds',
      {},
      browserExtensionChannel({
        type: 'background',
      })
    );

    console.log(`getAllTabIds`, result);

    elements.result.textContent = `Tab IDs: ${result.join(', ')}`;
  });
}

main().catch(console.error);
