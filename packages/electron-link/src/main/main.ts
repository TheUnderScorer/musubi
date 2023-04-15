import { ipcMain } from 'electron';
import { IpcMainReceiverLink } from './IpcMainReceiverLink';
import { IpcMainClientLink } from './IpcMainClientLink';
import { LinkPair } from '@musubi/core';

export function createMainLink() {
  return {
    receiver: new IpcMainReceiverLink(ipcMain),
    client: new IpcMainClientLink(ipcMain),
  } satisfies LinkPair<IpcMainClientLink, IpcMainReceiverLink>;
}

export { exposeElectronLink } from './expose';
