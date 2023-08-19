import { BrowserWindow, ipcMain } from 'electron';
import { IpcMainReceiverLink } from './IpcMainReceiverLink';
import { IpcMainClientLink } from './IpcMainClientLink';
import { LinkPair } from '@musubi/core';
import { ElectronWindows } from './ElectronWindows';

export interface ElectronLinkOptions {
  windows?: BrowserWindow[];
}

export function createMainLink({ windows }: ElectronLinkOptions = {}) {
  const electronWindows = new ElectronWindows(windows ?? []);

  return {
    receiver: new IpcMainReceiverLink(ipcMain, electronWindows),
    client: new IpcMainClientLink(ipcMain, electronWindows),
  } satisfies LinkPair<IpcMainClientLink, IpcMainReceiverLink>;
}

export { exposeElectronLink } from './expose';
export * from './context';
