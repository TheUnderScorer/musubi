import { contextBridge, ipcRenderer } from 'electron';
import { IpcRendererClientLink } from './IpcRendererClientLink';
import { IpcRendererReceiverLink } from './IpcRendererReceiverLink';
import { z } from 'zod';

export type ExposedMusubiLink = z.infer<typeof exposedMusubiLinkSchema>;

export const exposedMusubiLinkSchema = z.object({
  client: z.instanceof(IpcRendererClientLink),
  receiver: z.instanceof(IpcRendererReceiverLink),
});

export function exposeElectronLink() {
  const link = {
    client: new IpcRendererClientLink(ipcRenderer),
    receiver: new IpcRendererReceiverLink(ipcRenderer),
  } as ExposedMusubiLink;

  contextBridge.exposeInMainWorld('musubiLink', link);
}
