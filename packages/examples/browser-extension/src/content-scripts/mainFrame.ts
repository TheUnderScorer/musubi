import { createBrowserExtensionLink } from '@musubi/browser-extension-link';
import { MusubiClient, MusubiReceiver } from '@musubi/core';
import { browserExtensionSchema } from '../schema';

async function main() {
  const link = createBrowserExtensionLink('tab');

  const client = new MusubiClient(browserExtensionSchema, [link.client]);
  const receiver = new MusubiReceiver(browserExtensionSchema, [link.receiver]);

  receiver.handleCommand('replaceContent', async (payload) => {
    document.body.textContent = payload.content;

    await receiver.dispatchEvent('contentReplaced');
  });

  addButtons(client);

  console.log('main frame content script ready!');
}

function addButtons(client: MusubiClient<typeof browserExtensionSchema>) {
  const btn = document.createElement('button');
  btn.textContent = 'Close right tab (sends message to background)';

  btn.addEventListener('click', async () => {
    await client.command('closeRightTab');
  });

  document.body.appendChild(btn);
}

main().catch(console.error);
