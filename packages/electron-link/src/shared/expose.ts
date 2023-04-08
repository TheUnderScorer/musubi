import { z } from 'zod';
import { IpcRendererClientLink } from '../renderer/IpcRendererClientLink';
import { IpcRendererReceiverLink } from '../renderer/IpcRendererReceiverLink';
import { IpcRendererEvent } from 'electron';

export type ExposedMusubiLink = {
  send: (message: unknown) => void;

  receive: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (event: IpcRendererEvent, ...message: any[]) => void
  ) => () => void;
};
export const exposedMusubiLinkSchema = z.object({
  client: z.instanceof(IpcRendererClientLink),
  receiver: z.instanceof(IpcRendererReceiverLink),
});
