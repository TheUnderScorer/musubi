import { createBrowserExtensionLink } from '@musubi/browser-extension-link';
import { CommunicatorClient, CommunicatorReceiver } from '@musubi/core';
import { browserExtensionSchema, defaultChannels } from '../schema';

async function main() {
  const link = createBrowserExtensionLink('tab', defaultChannels);

  const client = new CommunicatorClient(browserExtensionSchema, [link.client]);
  const receiver = new CommunicatorReceiver(browserExtensionSchema, [
    link.receiver,
  ]);

  receiver.handleCommand('replaceContent', async (payload) => {
    document.body.textContent = payload.content;

    await receiver.dispatchEvent('contentReplaced', {});
  });

  addButtons(client);

  console.log('main frame content script ready!');
}

function addButtons(client: CommunicatorClient<typeof browserExtensionSchema>) {
  const btn = document.createElement('button');
  btn.textContent = 'Close right tab (sends message to background)';

  btn.addEventListener('click', async () => {
    await client.command('closeRightTab', {});
  });

  document.body.appendChild(btn);
}

main().catch(console.error);
