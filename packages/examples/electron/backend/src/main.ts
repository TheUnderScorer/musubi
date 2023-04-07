import { app, BrowserWindow } from 'electron';
import { createMainLink } from '@musubi/electron-link/main';
import { CommunicatorReceiver } from '@musubi/core';
import { electronSchema } from '@musubi/examples/electron/shared';

async function main() {
  await app.whenReady();

  const link = createMainLink();

  console.log(electronSchema);

  const receiver = new CommunicatorReceiver(electronSchema, [link.receiver]);

  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      //preload: ''
    },
  });

  await window.loadURL('http://localhost:4200');

  receiver.handleCommand('closeWindow', async (payload) => {
    let window: BrowserWindow | undefined | null;

    if (payload.windowId === 'current') {
      window = BrowserWindow.getFocusedWindow();
    } else {
      window = BrowserWindow.fromId(payload.windowId);
    }

    window?.close();
  });

  console.log('Hello World!');
}

main();
