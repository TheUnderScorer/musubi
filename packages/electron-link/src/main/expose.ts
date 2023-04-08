import { contextBridge, ipcRenderer } from 'electron';
import { ExposedMusubiLink } from '../shared/expose';
import { ELECTRON_MESSAGE_CHANNEL } from '../shared/channel';

export function exposeElectronLink() {
  const link: ExposedMusubiLink = {
    send: (message) => {
      ipcRenderer.send(ELECTRON_MESSAGE_CHANNEL, message);
    },
    receive: (handler) => {
      ipcRenderer.on(ELECTRON_MESSAGE_CHANNEL, handler);

      return () => {
        ipcRenderer.off(ELECTRON_MESSAGE_CHANNEL, handler);
      };
    },
  };

  contextBridge.exposeInMainWorld('musubiLink', link);
}
