import { ipcMain } from 'electron';
import { IpcMainReceiverLink } from './IpcMainReceiverLink';
import { IpcMainClientLink } from './IpcMainClientLink';
import { LinkPair } from '@musubi/core';

export function createMainLink(): LinkPair<
  IpcMainClientLink,
  IpcMainReceiverLink
> {
  return {
    receiver: new IpcMainReceiverLink(ipcMain),
    client: new IpcMainClientLink(ipcMain),
  };
}

export { exposeElectronLink } from './expose';
