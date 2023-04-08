import { createRendererLink } from '@musubi/electron-link/renderer';
import { electronSchema } from '@musubi/examples/electron/shared';
import { CommunicatorClient, CommunicatorReceiver } from '@musubi/core';

const link = createRendererLink();

const receiver = new CommunicatorReceiver(electronSchema, [link.receiver]);
const client = new CommunicatorClient(electronSchema, [link.client]);

function initButtons() {
  receiver.handleQuery('getWindowTimerValue', () => {
    return Number(document.querySelector('#timerValue')?.textContent ?? '');
  });

  document.addEventListener(
    'click',
    async (event) => {
      await receiver.dispatchEvent('mouseClickedInRenderer', {
        x: event.clientX,
        y: event.clientY,
      });
    },
    {
      passive: true,
    }
  );

  document.querySelector('#maximize')?.addEventListener('click', async () => {
    await client.command('maximize');
  });

  document.querySelector('#exitApp')?.addEventListener('click', async () => {
    await client.command('closeApp');
  });

  client.observeEvent('timerIncremented').subscribe((event) => {
    const timerValue = document.querySelector('#timerValue');

    if (timerValue) {
      timerValue.textContent = event.payload.toString();
    }
  });
}

document.addEventListener('DOMContentLoaded', initButtons);
