import { BrowserWindow } from 'electron';
import { electronChannelSchema } from '../shared/channel';

export function getWindowFromChannel(channel: unknown) {
  const windowId = electronChannelSchema.safeParse(channel);

  return windowId.success ? BrowserWindow.fromId(windowId.data) : null;
}
