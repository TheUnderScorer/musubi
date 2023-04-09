import { app, BrowserWindow, WebPreferences } from 'electron';
import { createMainLink } from '@musubi/electron-link/main';
import { createMusubi } from '@musubi/core';
import { electronSchema } from '@musubi/examples/electron/shared';
import * as path from 'path';

const webPreferences: WebPreferences = {
  preload: path.resolve(__dirname, './preload.js'),
};

async function main() {
  await app.whenReady();

  const link = createMainLink();

  const { client, receiver } = createMusubi({
    clientLinks: [link.client],
    receiverLinks: [link.receiver],
    schema: electronSchema,
  });

  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences,
  });

  await window.loadURL('http://localhost:4200');
  window.webContents.openDevTools();

  /**
   * Examples of handling commands and events from windows
   * */
  client.observeEvent('mouseClickedInRenderer').subscribe((event) => {
    const window = BrowserWindow.fromWebContents(event.ctx.event.sender);

    console.log(
      'mouseClickedInRenderer',
      event.payload,
      'in window',
      window?.id
    );
  });

  receiver.handleCommand('closeApp', () => {
    app.exit();
  });

  receiver.handleCommand('maximize', (_, ctx) => {
    const window = BrowserWindow.fromWebContents(ctx.event.sender);

    window?.maximize();

    console.log('maximize requested from window', window?.id);
  });

  /**
   * Example of sending message to given window
   * */
  setInterval(async () => {
    // This will send query to given window
    const timer = await client.query(
      'getWindowTimerValue',
      undefined,
      window.id
    );

    // This will dispatch event to all windows
    await receiver.dispatchEvent('timerIncremented', timer + 1);
  }, 5000);
}

void main();
