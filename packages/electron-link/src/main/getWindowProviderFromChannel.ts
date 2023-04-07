import { BrowserWindow } from 'electron';
import { electronChannelSchema } from '../shared/channel';

export function getWindowProviderFromChannel(channel: unknown) {
  const windowId = electronChannelSchema.safeParse(channel);

  let window = windowId.success ? BrowserWindow.fromId(windowId.data) : null;

  window?.on('close', () => {
    window = null;
  });

  return {
    get: () => window,
  };
}
