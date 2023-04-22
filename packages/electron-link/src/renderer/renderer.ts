import { ExposedMusubiLink } from '../shared/expose';
import { IpcRendererReceiverLink } from './IpcRendererReceiverLink';
import { IpcRendererClientLink } from './IpcRendererClientLink';

export function createRendererLink() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const link = (window as any).musubiLink as ExposedMusubiLink;

  if (!link) {
    throw new Error(
      'Musubi link is not exposed. Did you forget to call exposeElectronLink()?'
    );
  }

  return {
    receiver: new IpcRendererReceiverLink(link),
    client: new IpcRendererClientLink(link),
  };
}

export * from './context';
