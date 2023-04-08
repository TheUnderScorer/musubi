import { ipcMain } from 'electron';
import { IpcMainReceiverLink } from './IpcMainReceiverLink';
import { IpcMainClientLink } from './IpcMainClientLink';

export function createMainLink() {
  return {
    receiver: new IpcMainReceiverLink(ipcMain),
    client: new IpcMainClientLink(ipcMain),
  };
}

export { exposeElectronLink } from './expose';
